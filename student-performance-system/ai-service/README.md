# Student Performance AI Service

A machine learning service for predicting student academic performance using Random Forest models. Built with Flask and scikit-learn, this service provides real-time predictions for student scores and pass/fail outcomes based on academic and extracurricular performance metrics.

## 🤖 Features

- **Score Prediction** - Predicts total academic score using regression model
- **Pass/Fail Classification** - Determines if student will pass based on performance
- **Real-time Inference** - Fast prediction API with low latency
- **Health Monitoring** - Service health checks and status endpoints
- **Docker Support** - Containerized deployment with optimized builds
- **RESTful API** - Clean HTTP API with JSON responses

## 🛠️ Technology Stack

- **Runtime**: Python 3.12+
- **Web Framework**: Flask 2.3.3
- **ML Library**: scikit-learn 1.8.0
- **Data Processing**: pandas 2.2.0, numpy 2.4.4
- **Model Serialization**: joblib 1.5.3
- **Scientific Computing**: scipy 1.17.1

## 📁 Project Structure

```
ai-service/
├── app.py              # Main Flask application
├── main.py             # Utility script (currently minimal)
├── train_model.py      # Model training script
├── requirements.txt    # Python dependencies
├── pyproject.toml      # Python project configuration
├── Dockerfile          # Docker container configuration
├── .dockerignore       # Docker build exclusions
├── .python-version     # Python version specification
├── uv.lock             # Dependency lock file
├── reg.pkl            # Trained regression model
├── clf.pkl            # Trained classification model
└── README.md          # This file
```

## 🎯 ML Model Details

### Prediction Features

The model uses 7 input features to make predictions:

- **examScore** (0-100): Final examination score
- **assignmentScore** (0-100): Assignment completion score
- **seminarScore** (0-100): Seminar presentation score
- **projectScore** (0-100): Project work score
- **sportsScore** (0-50): Sports participation score
- **hackathonScore** (0-50): Hackathon participation score
- **attendance** (0-100): Class attendance percentage

### Scoring Algorithm

The model was trained on synthetic data using this weighted scoring formula:

```
totalScore = (examScore × 0.4) +
            (assignmentScore × 0.2) +
            (projectScore × 0.2) +
            (seminarScore × 0.1) +
            ((sportsScore + hackathonScore) × 0.1)
```

### Models Used

- **Regressor**: Random Forest Regressor for continuous score prediction
- **Classifier**: Random Forest Classifier for binary pass/fail prediction
- **Pass Threshold**: 50% (scores ≥ 50 pass, < 50 fail)

## 🚀 Installation & Setup

### Prerequisites

- Python 3.12 or higher
- pip or uv package manager

### Local Development Setup

1. **Navigate to ai-service directory:**
   ```bash
   cd ai-service
   ```

2. **Create virtual environment:**
   ```bash
   # Using venv
   python -m venv .venv
   .venv\Scripts\activate  # Windows
   source .venv/bin/activate  # Linux/Mac

   # Or using uv (recommended)
   uv venv
   uv pip install -e .
   ```

3. **Install dependencies:**
   ```bash
   # Using pip
   pip install -r requirements.txt

   # Or using uv
   uv pip install -r requirements.txt
   ```

4. **Verify models exist:**
   ```bash
   ls *.pkl
   # Should show: clf.pkl reg.pkl
   ```

5. **Start the service:**
   ```bash
   python app.py
   ```

The API will be available at `http://localhost:8000`

## 🐳 Docker Setup

### Build and Run

```bash
# Build the image
docker build -t student-performance-ai .

# Run the container
docker run -p 8000:8000 student-performance-ai
```

### Docker Compose (Full Stack)

For the complete application:

```bash
# From project root
docker compose up --build ai-service
```

## 🌐 API Endpoints

### Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "ok"
}
```

### Score Prediction
```http
POST /predict
```

**Request Body:**
```json
{
  "examScore": 85,
  "assignmentScore": 80,
  "seminarScore": 75,
  "projectScore": 90,
  "sportsScore": 20,
  "hackathonScore": 25,
  "attendance": 95
}
```

**Response:**
```json
{
  "predictedScore": 82.5,
  "pass": 1
}
```

**Field Descriptions:**
- `predictedScore`: Float between 0-100 (predicted total score)
- `pass`: Integer (1 = Pass, 0 = Fail)

## 🔄 API Usage Examples

### Using curl
```bash
# Health check
curl http://localhost:8000/health

# Get prediction
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "examScore": 85,
    "assignmentScore": 80,
    "seminarScore": 75,
    "projectScore": 90,
    "sportsScore": 20,
    "hackathonScore": 25,
    "attendance": 95
  }'
```

### Using Python
```python
import requests

# Health check
response = requests.get('http://localhost:8000/health')
print(response.json())

# Get prediction
data = {
    "examScore": 85,
    "assignmentScore": 80,
    "seminarScore": 75,
    "projectScore": 90,
    "sportsScore": 20,
    "hackathonScore": 25,
    "attendance": 95
}

response = requests.post('http://localhost:8000/predict', json=data)
result = response.json()
print(f"Predicted Score: {result['predictedScore']}")
print(f"Pass: {bool(result['pass'])}")
```

## 🏋️ Model Training

### Retrain Models

To retrain the models with new data:

1. **Modify training data in `train_model.py`:**
   ```python
   # Update the data generation or load real data
   data = {
       "examScore": [...],
       "assignmentScore": [...],
       # ... other features
   }
   ```

2. **Run training script:**
   ```bash
   python train_model.py
   ```

3. **Restart the service** to load new models

### Training Script Details

The `train_model.py` script:
- Generates synthetic training data (2000 samples)
- Uses weighted scoring formula for labels
- Trains Random Forest models with default parameters
- Saves models as pickle files (`reg.pkl`, `clf.pkl`)

### Model Performance

Current models were trained on synthetic data. For production use:
- Replace synthetic data with real student performance data
- Perform cross-validation and hyperparameter tuning
- Evaluate model performance metrics (MAE, accuracy, etc.)
- Consider feature engineering and selection

## 🔧 Development

### Available Scripts

```bash
# Start Flask development server
python app.py

# Run training script
python train_model.py

# Run utility script
python main.py
```

### Code Structure

- **`app.py`**: Main Flask application with routes and model loading
- **`train_model.py`**: Model training and serialization
- **`main.py`**: Placeholder for additional utilities

### Adding New Features

1. **New Prediction Endpoint:**
   ```python
   @app.route("/new-endpoint", methods=["POST"])
   def new_prediction():
       # Add your prediction logic here
       pass
   ```

2. **Model Updates:**
   - Modify `train_model.py` for new features/algorithms
   - Update API endpoints to handle new inputs
   - Retrain and redeploy models

## 🧪 Testing

### Manual Testing

```bash
# Test health endpoint
curl http://localhost:8000/health

# Test prediction with sample data
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"examScore": 75, "assignmentScore": 70, "seminarScore": 65, "projectScore": 80, "sportsScore": 15, "hackathonScore": 10, "attendance": 85}'
```

### Automated Testing

```python
# Create test file (tests/test_api.py)
import requests
import pytest

def test_health_check():
    response = requests.get('http://localhost:8000/health')
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_prediction():
    data = {
        "examScore": 85, "assignmentScore": 80, "seminarScore": 75,
        "projectScore": 90, "sportsScore": 20, "hackathonScore": 25,
        "attendance": 95
    }
    response = requests.post('http://localhost:8000/predict', json=data)
    assert response.status_code == 200
    result = response.json()
    assert 'predictedScore' in result
    assert 'pass' in result
    assert 0 <= result['predictedScore'] <= 100
    assert result['pass'] in [0, 1]
```

## 🚀 Deployment

### Production Considerations

1. **Model Versioning**: Track model versions and performance
2. **Monitoring**: Add logging and metrics collection
3. **Security**: Implement input validation and rate limiting
4. **Scaling**: Consider model optimization for production load
5. **CI/CD**: Automate testing and deployment pipelines

### Environment Variables

```bash
# Flask configuration
FLASK_ENV=production
FLASK_DEBUG=false

# Service configuration
PORT=8000
HOST=0.0.0.0
```

### Docker Production Build

```dockerfile
# Use multi-stage build for smaller production image
FROM python:3.12-slim as builder
# ... build dependencies

FROM python:3.12-slim
# ... copy only necessary files
EXPOSE 8000
CMD ["python", "app.py"]
```

## 🔍 Troubleshooting

### Common Issues

1. **Model files not found:**
   ```
   FileNotFoundError: No such file or directory: 'reg.pkl'
   ```
   **Solution:** Run `python train_model.py` to generate model files

2. **Port already in use:**
   ```
   OSError: [Errno 48] Address already in use
   ```
   **Solution:** Change port in `app.py` or free up port 8000

3. **Import errors:**
   ```
   ModuleNotFoundError: No module named 'flask'
   ```
   **Solution:** Install dependencies with `pip install -r requirements.txt`

4. **Memory issues with large models:**
   **Solution:** Optimize model size or increase container memory limits

### Performance Optimization

- **Model Size**: Consider model compression for deployment
- **Caching**: Implement response caching for frequent predictions
- **Async Processing**: Use async Flask for concurrent requests
- **Model Serving**: Consider using ML serving frameworks like BentoML

## 📊 Model Evaluation

### Current Model Metrics (Estimated)

Based on synthetic training data:
- **Regression MAE**: ~2-3 points on score prediction
- **Classification Accuracy**: ~85-90% on pass/fail prediction
- **Training Time**: < 5 seconds
- **Inference Time**: < 100ms per prediction

### Improving Model Performance

1. **Real Data**: Replace synthetic data with actual student performance data
2. **Feature Engineering**: Add derived features (ratios, trends, etc.)
3. **Hyperparameter Tuning**: Use GridSearchCV or RandomizedSearchCV
4. **Cross-Validation**: Implement proper validation strategies
5. **Ensemble Methods**: Try different algorithms (XGBoost, LightGBM)
6. **Feature Selection**: Identify most important features

## 📝 Contributing

1. Follow Python best practices and PEP 8 style guide
2. Add type hints for better code documentation
3. Write tests for new features
4. Update this README for API changes
5. Use meaningful commit messages

## 📄 License

See project root LICENSE file for details.

## 📞 Support

For issues and questions:
1. Check existing GitHub issues
2. Review API documentation
3. Test with provided examples
4. Create detailed bug reports with:
   - Input data causing issues
   - Expected vs actual output
   - Environment details (Python version, dependencies)