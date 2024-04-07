import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, LabelEncoder
from .dtypes_map import data_type_mapping

def read_file(file_path):
    """
    Read a file into a Pandas DataFrame.
    
    Args:
        file_path (str): The path to the file. Supported formats are .xlsx, .xls, and .csv.
        
    Returns:
        pandas.DataFrame: The DataFrame containing the data from the file.
        
    Raises:
        ValueError: If the file format is not supported.
    """
    # Load the data into a Pandas DataFrame
    if file_path.endswith('.xlsx'):
        df = pd.read_excel(file_path)
    elif file_path.endswith('.xls'):
        df = pd.read_excel(file_path, engine='xlrd')
    elif file_path.endswith('.csv'):
        df = pd.read_csv(file_path, thousands=',', low_memory=False)
    else:
        raise ValueError("Unsupported file format. Please provide a .xlsx, .xls, or .csv file.")
    
    return df

def infer_and_convert_data_types(df):
    """
    Infer and convert data types in a CSV or Excel file.
    
    Args:
        file_path (str): The path to the CSV or Excel file.
        
    Returns:
        pandas.DataFrame: The DataFrame with the converted data types.
    """    
    # Infer data types
    df = df.infer_objects()

    # Further type inference and conversion
    for column in df.columns:
        if df[column].dtype == 'object':
            # Try to convert to datetime
            try:
                df[column] = pd.to_datetime(df[column])
            except ValueError:
                # Try to convert to numeric
                try:
                    df[column] = pd.to_numeric(df[column].str.replace(',', ''))
                except (ValueError, AttributeError):
                    # Try to convert to categorical if the number of unique values is less than 50%
                    if df[column].nunique() / len(df) < 0.5:
                        df[column] = df[column].astype('category')

    return df

def convert_to_user_friendly_type(df):
    """
    Convert the data types of a DataFrame to user-friendly types.
    
    Args:
        df (pandas.DataFrame): The DataFrame whose data types are to be converted.
        
    Returns:
        dict: A dictionary mapping column names to their user-friendly data types.
    """
    user_friendly_data_types = {}
    for column_name, data_type in df.dtypes.items():
        user_friendly_type = data_type_mapping.get(str(data_type), str(data_type))
        user_friendly_data_types[column_name] = user_friendly_type

    return user_friendly_data_types


def clean_and_standardize_data(df):
    # Drop rows with missing values
    df.dropna(inplace=True)
    
    # Remove leading/trailing whitespace from string columns
    string_columns = df.select_dtypes(include=['object']).columns
    df[string_columns] = df[string_columns].apply(lambda x: x.str.strip())
    
    # Convert datetime columns to datetime type
    datetime_columns = df.select_dtypes(include=['datetime']).columns
    df[datetime_columns] = df[datetime_columns].apply(pd.to_datetime)
    
    # Standardize numeric columns using Z-score normalization
    numeric_columns = df.select_dtypes(include=['float', 'int']).columns
    scaler = StandardScaler()
    df[numeric_columns] = scaler.fit_transform(df[numeric_columns])
    
    # Encode categorical columns using label encoding
    categorical_columns = df.select_dtypes(include=['category']).columns
    label_encoder = LabelEncoder()
    for column in categorical_columns:
        df[column] = label_encoder.fit_transform(df[column])
    
    # Handle duplicate rows
    df.drop_duplicates(inplace=True)
    
    # Reset the index if needed
    df.reset_index(drop=True, inplace=True)
    
    return df