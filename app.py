from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import pandas as pd
import numpy as np
import plotly.graph_objects as go
import plotly.express as px
import json
import os
from dotenv import load_dotenv
import sqlite3
import sqlalchemy
from sqlalchemy import create_engine, text
import openai
from datetime import datetime
import traceback

load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///bulb_ai.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# OpenAI Configuration (you'll need to set your API key)
openai.api_key = os.getenv('OPENAI_API_KEY', '')

class DataSource(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    connection_string = db.Column(db.String(500), nullable=False)
    database_type = db.Column(db.String(50), nullable=False)  # postgresql, mysql, sqlite, sqlserver
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Query(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    natural_language = db.Column(db.Text, nullable=False)
    generated_sql = db.Column(db.Text)
    generated_python = db.Column(db.Text)
    results = db.Column(db.Text)  # JSON string
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    data_source_id = db.Column(db.Integer, db.ForeignKey('data_source.id'))

class AIService:
    @staticmethod
    def generate_sql_from_natural_language(natural_query, table_schema=None):
        """Generate SQL query from natural language using AI"""
        try:
            schema_context = ""
            if table_schema:
                schema_context = f"Database schema: {table_schema}\n\n"
            
            prompt = f"""
            {schema_context}Convert this natural language query to SQL:
            "{natural_query}"
            
            Return only the SQL query without any explanation or markdown formatting.
            """
            
            response = openai.Completion.create(
                engine="text-davinci-003",
                prompt=prompt,
                max_tokens=200,
                temperature=0.1
            )
            
            return response.choices[0].text.strip()
        except Exception as e:
            # Fallback to basic SQL generation
            return f"SELECT * FROM data WHERE description LIKE '%{natural_query}%' LIMIT 100;"
    
    @staticmethod
    def generate_python_from_sql(sql_query, table_name="data"):
        """Generate equivalent Python pandas code from SQL"""
        try:
            prompt = f"""
            Convert this SQL query to equivalent Python pandas code:
            "{sql_query}"
            
            Assume the data is in a pandas DataFrame called 'df'.
            Return only the Python code without any explanation or markdown formatting.
            """
            
            response = openai.Completion.create(
                engine="text-davinci-003",
                prompt=prompt,
                max_tokens=300,
                temperature=0.1
            )
            
            return response.choices[0].text.strip()
        except Exception as e:
            # Fallback to basic pandas code
            return f"# Generated from SQL: {sql_query}\nresult = df.head(100)"
    
    @staticmethod
    def analyze_data_quality(df):
        """Analyze data quality and provide AI suggestions"""
        quality_report = {
            'total_rows': len(df),
            'total_columns': len(df.columns),
            'missing_values': df.isnull().sum().to_dict(),
            'duplicate_rows': df.duplicated().sum(),
            'data_types': df.dtypes.astype(str).to_dict(),
            'suggestions': []
        }
        
        # Add AI-powered suggestions
        for col in df.columns:
            missing_pct = (df[col].isnull().sum() / len(df)) * 100
            if missing_pct > 10:
                quality_report['suggestions'].append({
                    'column': col,
                    'issue': f'High missing values ({missing_pct:.1f}%)',
                    'suggestion': 'Consider imputation or removal of this column'
                })
        
        if quality_report['duplicate_rows'] > 0:
            quality_report['suggestions'].append({
                'issue': f'{quality_report["duplicate_rows"]} duplicate rows found',
                'suggestion': 'Remove duplicate rows to improve data quality'
            })
        
        return quality_report

class DatabaseManager:
    @staticmethod
    def create_connection(connection_string, db_type):
        """Create database connection based on type"""
        try:
            if db_type == 'sqlite':
                engine = create_engine(f'sqlite:///{connection_string}')
            elif db_type == 'postgresql':
                engine = create_engine(connection_string)
            elif db_type == 'mysql':
                engine = create_engine(connection_string)
            elif db_type == 'sqlserver':
                engine = create_engine(connection_string)
            else:
                raise ValueError(f"Unsupported database type: {db_type}")
            
            return engine
        except Exception as e:
            raise Exception(f"Failed to connect to database: {str(e)}")
    
    @staticmethod
    def execute_query(engine, query):
        """Execute SQL query and return results as DataFrame"""
        try:
            with engine.connect() as connection:
                result = pd.read_sql(query, connection)
                return result
        except Exception as e:
            raise Exception(f"Query execution failed: {str(e)}")
    
    @staticmethod
    def get_table_schema(engine, table_name=None):
        """Get database schema information"""
        try:
            with engine.connect() as connection:
                if table_name:
                    query = f"PRAGMA table_info({table_name})" if 'sqlite' in str(engine.url) else f"DESCRIBE {table_name}"
                else:
                    query = "SELECT name FROM sqlite_master WHERE type='table'" if 'sqlite' in str(engine.url) else "SHOW TABLES"
                
                result = pd.read_sql(query, connection)
                return result.to_dict('records')
        except Exception as e:
            return []

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/data-sources', methods=['GET', 'POST'])
def handle_data_sources():
    if request.method == 'POST':
        data = request.json
        try:
            # Test connection first
            engine = DatabaseManager.create_connection(
                data['connection_string'], 
                data['database_type']
            )
            
            # If successful, save to database
            data_source = DataSource(
                name=data['name'],
                connection_string=data['connection_string'],
                database_type=data['database_type']
            )
            db.session.add(data_source)
            db.session.commit()
            
            return jsonify({
                'success': True,
                'message': 'Data source added successfully',
                'id': data_source.id
            })
        except Exception as e:
            return jsonify({
                'success': False,
                'error': str(e)
            }), 400
    
    else:  # GET
        data_sources = DataSource.query.all()
        return jsonify([{
            'id': ds.id,
            'name': ds.name,
            'database_type': ds.database_type,
            'created_at': ds.created_at.isoformat()
        } for ds in data_sources])

@app.route('/api/query', methods=['POST'])
def execute_query():
    data = request.json
    natural_query = data.get('query', '')
    data_source_id = data.get('data_source_id')
    
    try:
        # Get data source
        data_source = DataSource.query.get(data_source_id)
        if not data_source:
            return jsonify({'error': 'Data source not found'}), 404
        
        # Create database connection
        engine = DatabaseManager.create_connection(
            data_source.connection_string,
            data_source.database_type
        )
        
        # Get schema for context
        schema = DatabaseManager.get_table_schema(engine)
        
        # Generate SQL from natural language
        generated_sql = AIService.generate_sql_from_natural_language(
            natural_query, schema
        )
        
        # Execute SQL query
        results_df = DatabaseManager.execute_query(engine, generated_sql)
        
        # Generate equivalent Python code
        generated_python = AIService.generate_python_from_sql(generated_sql)
        
        # Analyze data quality
        quality_report = AIService.analyze_data_quality(results_df)
        
        # Convert results to JSON
        results_json = results_df.to_json(orient='records')
        
        # Save query to database
        query_record = Query(
            natural_language=natural_query,
            generated_sql=generated_sql,
            generated_python=generated_python,
            results=results_json,
            data_source_id=data_source_id
        )
        db.session.add(query_record)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'query_id': query_record.id,
            'generated_sql': generated_sql,
            'generated_python': generated_python,
            'results': results_df.to_dict('records'),
            'quality_report': quality_report,
            'row_count': len(results_df),
            'columns': list(results_df.columns)
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'traceback': traceback.format_exc()
        }), 500

@app.route('/api/visualize', methods=['POST'])
def create_visualization():
    data = request.json
    query_id = data.get('query_id')
    chart_type = data.get('chart_type', 'bar')
    x_column = data.get('x_column')
    y_column = data.get('y_column')
    
    try:
        # Get query results
        query_record = Query.query.get(query_id)
        if not query_record:
            return jsonify({'error': 'Query not found'}), 404
        
        # Parse results
        results = json.loads(query_record.results)
        df = pd.DataFrame(results)
        
        # Create visualization based on type
        if chart_type == 'bar':
            fig = px.bar(df, x=x_column, y=y_column, title=f'{y_column} by {x_column}')
        elif chart_type == 'line':
            fig = px.line(df, x=x_column, y=y_column, title=f'{y_column} over {x_column}')
        elif chart_type == 'scatter':
            fig = px.scatter(df, x=x_column, y=y_column, title=f'{y_column} vs {x_column}')
        elif chart_type == 'histogram':
            fig = px.histogram(df, x=x_column, title=f'Distribution of {x_column}')
        else:
            fig = px.bar(df, x=x_column, y=y_column)
        
        # Convert to JSON
        chart_json = fig.to_json()
        
        return jsonify({
            'success': True,
            'chart': json.loads(chart_json)
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/export', methods=['POST'])
def export_data():
    data = request.json
    query_id = data.get('query_id')
    export_type = data.get('type', 'csv')  # csv, json, sql
    
    try:
        query_record = Query.query.get(query_id)
        if not query_record:
            return jsonify({'error': 'Query not found'}), 404
        
        if export_type == 'sql':
            return jsonify({
                'success': True,
                'content': query_record.generated_sql,
                'filename': f'query_{query_id}.sql'
            })
        elif export_type == 'python':
            return jsonify({
                'success': True,
                'content': query_record.generated_python,
                'filename': f'analysis_{query_id}.py'
            })
        else:
            results = json.loads(query_record.results)
            df = pd.DataFrame(results)
            
            if export_type == 'csv':
                csv_content = df.to_csv(index=False)
                return jsonify({
                    'success': True,
                    'content': csv_content,
                    'filename': f'results_{query_id}.csv'
                })
            elif export_type == 'json':
                return jsonify({
                    'success': True,
                    'content': query_record.results,
                    'filename': f'results_{query_id}.json'
                })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/sample-data', methods=['POST'])
def create_sample_data():
    """Create sample data for demonstration"""
    try:
        # Create sample SQLite database
        sample_db_path = 'sample_data.db'
        conn = sqlite3.connect(sample_db_path)
        
        # Create sample tables
        sample_data = {
            'sales': pd.DataFrame({
                'id': range(1, 101),
                'product': np.random.choice(['Laptop', 'Phone', 'Tablet', 'Watch'], 100),
                'revenue': np.random.uniform(100, 2000, 100).round(2),
                'quantity': np.random.randint(1, 10, 100),
                'date': pd.date_range('2023-01-01', periods=100, freq='D')[:100],
                'region': np.random.choice(['North', 'South', 'East', 'West'], 100)
            }),
            'customers': pd.DataFrame({
                'id': range(1, 51),
                'name': [f'Customer {i}' for i in range(1, 51)],
                'email': [f'customer{i}@example.com' for i in range(1, 51)],
                'age': np.random.randint(18, 80, 50),
                'city': np.random.choice(['New York', 'Los Angeles', 'Chicago', 'Houston'], 50)
            })
        }
        
        for table_name, df in sample_data.items():
            df.to_sql(table_name, conn, if_exists='replace', index=False)
        
        conn.close()
        
        # Add to data sources
        sample_source = DataSource(
            name='Sample Data',
            connection_string=sample_db_path,
            database_type='sqlite'
        )
        db.session.add(sample_source)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Sample data created successfully',
            'data_source_id': sample_source.id
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0', port=5000)