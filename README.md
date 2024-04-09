# DataDazzle

DataDazzle is a web application that allows users to upload CSV or Excel files, infer and convert data types, and display the processed data in a user-friendly table format. The application is built using Django REST Framework for the backend and React with Tailwind CSS for the frontend.

DEMO: https://drive.google.com/file/d/17i47CEx6_c499ZrPcySs1RhLljKRDPu7/view?usp=sharing

## Features

- Upload CSV or Excel files (.xlsx, .xls, or .csv)
- Infer and convert data types automatically
- Display the processed data in a table format
- Allow users to override the inferred data types
- Display dates in a human-readable format
- Limit the displayed rows to the first 20 for better performance
- Copy the header and data types to the clipboard with a single click
- Download the entire table as a CSV file with data types in the first row and header in the second row

## Technologies Used

### Backend

- Django REST Framework
- Django CORS Headers
- openpyxl
- xlrd
- pandas

### Frontend

- React
- Tailwind CSS
- moment.js
- SweetAlert2
- Axios

## Setup and Installation

### Backend

1. Clone the repository:

   ```
   git clone https://github.com/your-username/DataDazzle.git
   ```

2. Navigate to the project directory:

   ```
   cd DataDazzle
   ```

3. Create a virtual environment (optional but recommended):

   ```
   python -m venv venv
   ```

4. Activate the virtual environment:

   - For Windows:
     ```
     venv\Scripts\activate
     ```
   - For macOS and Linux:
     ```
     source venv/bin/activate
     ```

5. Install the required backend dependencies:

   ```
   pip install -r requirements.txt
   ```

6. Apply the database migrations:

   ```
   python manage.py migrate
   ```

7. Start the Django development server:

   ```
   python manage.py runserver
   ```

   The backend server will run at `http://127.0.0.1:8000`.

### Frontend

1. Navigate to the `client` directory:

   ```
   cd client
   ```

2. Install the required frontend dependencies:

   ```
   npm install
   ```

   or

   ```
   yarn install
   ```

3. Start the React development server:

   ```
   npm start
   ```

   or

   ```
   yarn start
   ```

   The frontend server will run at `http://localhost:3000`.

## Usage

1. Open your web browser and go to `http://localhost:3000`.

2. Click on the "Upload File" button and select a CSV/Excel file or Drag and drop a CSV/Excel file to upload.

3. The application will process the file, infer and convert the data types, and display the processed data in a table format.

4. You can override the inferred data types by selecting a different data type from the dropdown menu in the table header.

5. The table will display the first 20 rows of the processed data. If the file contains more than 20 rows, the remaining rows will be truncated.

6. Date columns will be displayed in a human-readable format (YYYY-MM-DD).

## Additional Notes

- The application uses Django REST Framework for the backend API and React for the frontend user interface.

- The backend handles the file upload, data processing, and type inference using libraries such as pandas, openpyxl, and xlrd.

- The frontend communicates with the backend API using Axios for making HTTP requests.

- The frontend uses moment.js for parsing and formatting dates, and SweetAlert2 for displaying alerts and notifications.

- The table component in the frontend is built using React and styled with Tailwind CSS classes.

- The application is set up with Django CORS Headers to allow cross-origin requests between the frontend and backend.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
