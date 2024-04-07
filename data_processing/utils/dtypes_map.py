data_type_mapping = {
    # Numeric Types
    'int64': 'Integer',
    'int32': 'Integer',
    'int16': 'Integer',
    'int8': 'Integer',
    'uint8': 'Unsigned Integer',
    'uint16': 'Unsigned Integer',
    'uint32': 'Unsigned Integer',
    'uint64': 'Unsigned Integer',
    'float64': 'Float',
    'float32': 'Float',
    'float16': 'Float',
    'complex': 'Complex',
    'complex64': 'Complex',
    'complex128': 'Complex',

    # Boolean Type
    'bool': 'Boolean',
    'bool_': 'Boolean',

    # Date and Time Types
    'datetime64': 'Date',
    'datetime64[ns]': 'Date',
    'timedelta64': 'Time Delta',
    'timedelta64[ns]': 'Time Delta',

    # String Types
    'object': 'Text',
    'str_': 'Text',
    'unicode_': 'Unicode',

    # Other Types
    'category': 'Category',
    'bytes_': 'Bytes',
    'void': 'Void'
}