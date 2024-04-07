import pandas as pd
from .dtypes_map import data_type_mapping

def read_file(file_path):
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

def infer_and_convert_data_types(file_path):
    """
    Infer and convert data types in a CSV or Excel file.
    
    Args:
        file_path (str): The path to the CSV or Excel file.
        
    Returns:
        pandas.DataFrame: The DataFrame with the converted data types.
    """
    df = read_file(file_path)
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
    user_friendly_data_types = {}
    for column_name, data_type in df.dtypes.items():
        user_friendly_type = data_type_mapping.get(str(data_type), str(data_type))
        user_friendly_data_types[column_name] = user_friendly_type

    return user_friendly_data_types
