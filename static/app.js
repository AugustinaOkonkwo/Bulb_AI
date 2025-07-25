class BulbAI {
    constructor() {
        this.currentQueryId = null;
        this.currentResults = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadDataSources();
    }

    bindEvents() {
        // Modal events
        document.getElementById('addDataSourceBtn').addEventListener('click', () => {
            document.getElementById('dataSourceModal').classList.remove('hidden');
        });

        document.getElementById('closeModalBtn').addEventListener('click', () => {
            document.getElementById('dataSourceModal').classList.add('hidden');
        });

        document.getElementById('cancelModalBtn').addEventListener('click', () => {
            document.getElementById('dataSourceModal').classList.add('hidden');
        });

        // Form events
        document.getElementById('dataSourceForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addDataSource();
        });

        document.getElementById('executeQueryBtn').addEventListener('click', () => {
            this.executeQuery();
        });

        document.getElementById('createChartBtn').addEventListener('click', () => {
            this.createVisualization();
        });

        document.getElementById('sampleDataBtn').addEventListener('click', () => {
            this.createSampleData();
        });

        // Export events
        document.getElementById('exportCSVBtn').addEventListener('click', () => {
            this.exportData('csv');
        });

        document.getElementById('exportSQLBtn').addEventListener('click', () => {
            this.exportData('sql');
        });
    }

    async loadDataSources() {
        try {
            const response = await fetch('/api/data-sources');
            const dataSources = await response.json();
            
            const select = document.getElementById('dataSourceSelect');
            select.innerHTML = '<option value="">Select a data source...</option>';
            
            dataSources.forEach(ds => {
                const option = document.createElement('option');
                option.value = ds.id;
                option.textContent = `${ds.name} (${ds.database_type})`;
                select.appendChild(option);
            });
        } catch (error) {
            this.showError('Failed to load data sources');
        }
    }

    async addDataSource() {
        const name = document.getElementById('dsName').value;
        const type = document.getElementById('dsType').value;
        const connection = document.getElementById('dsConnection').value;

        if (!name || !connection) {
            this.showError('Please fill in all fields');
            return;
        }

        try {
            this.showLoading(true);
            
            const response = await fetch('/api/data-sources', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    database_type: type,
                    connection_string: connection
                })
            });

            const result = await response.json();
            
            if (result.success) {
                document.getElementById('dataSourceModal').classList.add('hidden');
                document.getElementById('dataSourceForm').reset();
                this.loadDataSources();
                this.showSuccess('Data source added successfully!');
            } else {
                this.showError(result.error);
            }
        } catch (error) {
            this.showError('Failed to add data source');
        } finally {
            this.showLoading(false);
        }
    }

    async createSampleData() {
        try {
            this.showLoading(true);
            
            const response = await fetch('/api/sample-data', {
                method: 'POST'
            });

            const result = await response.json();
            
            if (result.success) {
                this.loadDataSources();
                this.showSuccess('Sample data created successfully!');
            } else {
                this.showError(result.error);
            }
        } catch (error) {
            this.showError('Failed to create sample data');
        } finally {
            this.showLoading(false);
        }
    }

    async executeQuery() {
        const query = document.getElementById('naturalQuery').value.trim();
        const dataSourceId = document.getElementById('dataSourceSelect').value;

        if (!query) {
            this.showError('Please enter a query');
            return;
        }

        if (!dataSourceId) {
            this.showError('Please select a data source');
            return;
        }

        try {
            this.showLoading(true);
            
            const response = await fetch('/api/query', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    query: query,
                    data_source_id: parseInt(dataSourceId)
                })
            });

            const result = await response.json();
            
            if (result.success) {
                this.currentQueryId = result.query_id;
                this.currentResults = result.results;
                this.displayResults(result);
                this.addToHistory(query);
            } else {
                this.showError(result.error);
            }
        } catch (error) {
            this.showError('Failed to execute query');
        } finally {
            this.showLoading(false);
        }
    }

    displayResults(result) {
        // Show generated code
        document.getElementById('generatedSQL').textContent = result.generated_sql;
        document.getElementById('generatedPython').textContent = result.generated_python;
        document.getElementById('generatedCodeSection').classList.remove('hidden');

        // Show results table
        this.displayTable(result.results);
        document.getElementById('resultsSummary').textContent = 
            `${result.row_count} rows, ${result.columns.length} columns`;
        document.getElementById('resultsSection').classList.remove('hidden');

        // Show data quality report
        this.displayQualityReport(result.quality_report);
        document.getElementById('qualityReportSection').classList.remove('hidden');

        // Setup visualization options
        this.setupVisualizationOptions(result.columns);
        document.getElementById('visualizationSection').classList.remove('hidden');
    }

    displayTable(data) {
        if (!data || data.length === 0) {
            document.getElementById('resultsTable').innerHTML = '<p class="text-gray-500">No results found</p>';
            return;
        }

        const columns = Object.keys(data[0]);
        let html = '<table class="min-w-full divide-y divide-gray-200"><thead class="bg-gray-50"><tr>';
        
        columns.forEach(col => {
            html += `<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">${col}</th>`;
        });
        
        html += '</tr></thead><tbody class="bg-white divide-y divide-gray-200">';
        
        data.slice(0, 100).forEach((row, index) => {
            html += `<tr class="${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}">`;
            columns.forEach(col => {
                const value = row[col] !== null ? row[col] : 'NULL';
                html += `<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${value}</td>`;
            });
            html += '</tr>';
        });
        
        html += '</tbody></table>';
        
        if (data.length > 100) {
            html += `<p class="text-sm text-gray-500 mt-2">Showing first 100 of ${data.length} rows</p>`;
        }
        
        document.getElementById('resultsTable').innerHTML = html;
    }

    displayQualityReport(report) {
        let html = `
            <div class="space-y-4">
                <div class="grid grid-cols-2 gap-4 text-sm">
                    <div class="bg-blue-50 p-3 rounded">
                        <div class="font-semibold text-blue-900">Total Rows</div>
                        <div class="text-blue-700">${report.total_rows.toLocaleString()}</div>
                    </div>
                    <div class="bg-green-50 p-3 rounded">
                        <div class="font-semibold text-green-900">Total Columns</div>
                        <div class="text-green-700">${report.total_columns}</div>
                    </div>
                </div>
        `;

        if (report.duplicate_rows > 0) {
            html += `
                <div class="bg-yellow-50 border border-yellow-200 p-3 rounded">
                    <div class="font-semibold text-yellow-900">⚠️ ${report.duplicate_rows} duplicate rows found</div>
                </div>
            `;
        }

        if (report.suggestions && report.suggestions.length > 0) {
            html += '<div class="space-y-2"><h4 class="font-semibold text-gray-900">AI Suggestions:</h4>';
            report.suggestions.forEach(suggestion => {
                html += `
                    <div class="bg-orange-50 border border-orange-200 p-3 rounded text-sm">
                        <div class="font-medium text-orange-900">${suggestion.issue || suggestion.column}</div>
                        <div class="text-orange-700">${suggestion.suggestion}</div>
                    </div>
                `;
            });
            html += '</div>';
        }

        html += '</div>';
        document.getElementById('qualityReport').innerHTML = html;
    }

    setupVisualizationOptions(columns) {
        const xSelect = document.getElementById('xColumn');
        const ySelect = document.getElementById('yColumn');
        
        xSelect.innerHTML = '<option value="">X-Axis</option>';
        ySelect.innerHTML = '<option value="">Y-Axis</option>';
        
        columns.forEach(col => {
            xSelect.innerHTML += `<option value="${col}">${col}</option>`;
            ySelect.innerHTML += `<option value="${col}">${col}</option>`;
        });
    }

    async createVisualization() {
        if (!this.currentQueryId) {
            this.showError('No query results to visualize');
            return;
        }

        const chartType = document.getElementById('chartType').value;
        const xColumn = document.getElementById('xColumn').value;
        const yColumn = document.getElementById('yColumn').value;

        if (!xColumn) {
            this.showError('Please select X-axis column');
            return;
        }

        if (chartType !== 'histogram' && !yColumn) {
            this.showError('Please select Y-axis column');
            return;
        }

        try {
            const response = await fetch('/api/visualize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    query_id: this.currentQueryId,
                    chart_type: chartType,
                    x_column: xColumn,
                    y_column: yColumn
                })
            });

            const result = await response.json();
            
            if (result.success) {
                Plotly.newPlot('chartContainer', result.chart.data, result.chart.layout);
            } else {
                this.showError(result.error);
            }
        } catch (error) {
            this.showError('Failed to create visualization');
        }
    }

    async exportData(type) {
        if (!this.currentQueryId) {
            this.showError('No query results to export');
            return;
        }

        try {
            const response = await fetch('/api/export', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    query_id: this.currentQueryId,
                    type: type
                })
            });

            const result = await response.json();
            
            if (result.success) {
                this.downloadFile(result.content, result.filename);
            } else {
                this.showError(result.error);
            }
        } catch (error) {
            this.showError('Failed to export data');
        }
    }

    downloadFile(content, filename) {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }

    addToHistory(query) {
        const historyContainer = document.getElementById('queryHistory');
        const queryItem = document.createElement('div');
        queryItem.className = 'p-2 bg-gray-50 rounded text-sm border-l-4 border-blue-500';
        queryItem.innerHTML = `
            <div class="font-medium text-gray-900">${query}</div>
            <div class="text-gray-500 text-xs">${new Date().toLocaleTimeString()}</div>
        `;
        
        if (historyContainer.children.length === 1 && historyContainer.children[0].textContent.includes('No queries yet')) {
            historyContainer.innerHTML = '';
        }
        
        historyContainer.insertBefore(queryItem, historyContainer.firstChild);
        
        // Keep only last 5 queries
        while (historyContainer.children.length > 5) {
            historyContainer.removeChild(historyContainer.lastChild);
        }
    }

    showLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        if (show) {
            overlay.classList.remove('hidden');
        } else {
            overlay.classList.add('hidden');
        }
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
            type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
        }`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 5000);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new BulbAI();
});