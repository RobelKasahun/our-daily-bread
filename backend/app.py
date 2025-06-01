from app import create_app


app = create_app()

@app.route('/')
def home():
    return {'message': 'Hello, Flask backend is working!'}

# run the app in debug mode
# run the app when the file is executed directly
if __name__ == '__main__':
    app.run(debug=True)