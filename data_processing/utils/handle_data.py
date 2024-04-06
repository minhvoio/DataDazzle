import pandas as pd

def infer_and_convert_data_types(file_path):
    """
    Infer and convert data types in a CSV or Excel file.
    
    Args:
        file_path (str): The path to the CSV or Excel file.
        
    Returns:
        pandas.DataFrame: The DataFrame with the converted data types.
    """
    # Load the data into a Pandas DataFrame
    if file_path.endswith('.csv'):
        df = pd.read_csv(file_path, low_memory=False)
    elif file_path.endswith('.xlsx'):
        df = pd.read_excel(file_path)
    elif file_path.endswith('.xls'):
        df = pd.read_excel(file_path, engine='xlrd')
    else:
        raise ValueError("Unsupported file format. Please provide a CSV or Excel file.")
    
    # Infer and convert data types
    for col in df.columns:
        try:
            # Try to convert the column to a numeric type
            df[col] = pd.to_numeric(df[col], errors='coerce')
            
            # If the conversion was successful, set the appropriate numeric type
            if df[col].dtype == 'float64':
                df[col] = df[col].astype('float32')
            elif df[col].dtype == 'int64':
                df[col] = df[col].astype('int32')
        except (ValueError, TypeError):
            # If the conversion to numeric failed, try to convert to datetime
            try:
                df[col] = pd.to_datetime(df[col], infer_datetime_format=True, errors='coerce')
            except (ValueError, TypeError):
                # If the conversion to datetime failed, keep the column as object
                pass
        
        # Convert columns with only 'True' and 'False' values to boolean
        if df[col].dropna().isin([True, False]).all():
            df[col] = df[col].astype('bool')
        
        # Convert columns with a small number of unique values to category
        if df[col].nunique() < 0.1 * len(df):
            df[col] = df[col].astype('category')
    
    return df