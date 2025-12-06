# Riddler Backend

## Getting Started

### 1. Start MySQL Database
```bash
docker-compose up -d
```

Install MySQL on mac
```
brew install mysql
```
Connect using MySQL
```
mysql -h 127.0.0.1 -P 3306 -u riddler_user -priddler_password riddler_db
```


### 2. Set up Virtual Environment
```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Run the Application
```bash
# Make sure virtual environment is activated
source ./venv/bin/activate
python run.py
```

The application will start on http://localhost:5003

## Database Connection
```bash
mysql -h 127.0.0.1 -P 3306 -u riddler_user -priddler_password riddler_db
```
