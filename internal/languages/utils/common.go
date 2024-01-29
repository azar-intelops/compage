package utils

import corenode "github.com/intelops/compage/internal/core/node"

// GetFieldsDataTypeForProtobuf returns the protobuf data type for the given data type, Used in go struct
func GetFieldsDataTypeForProtobuf(value string) string {
	if value == "rune" ||
		value == "byte" ||
		value == "uintptr" ||
		value == "int" ||
		value == "int16" ||
		value == "int32" {
		return "int32"
	} else if value == "int64" ||
		value == "uint64" {
		return "int64"
	} else if value == "uint" ||
		value == "uint8" ||
		value == "uint16" ||
		value == "uint32" {
		return "uint32"
	} else if value == "bool" {
		return "bool"
	} else if value == "string" {
		return "string"
	}
	return value
}

// GetProtoBufDataType returns the protobuf data type for the given data type, Used in proto file
func GetProtoBufDataType(value string) string {
	if value == "rune" ||
		value == "byte" ||
		value == "uintptr" ||
		value == "int" ||
		value == "int16" ||
		value == "int32" {
		return "int32"
	} else if value == "int64" ||
		value == "uint64" {
		return "int64"
	} else if value == "uint" ||
		value == "uint8" ||
		value == "uint16" ||
		value == "uint32" {
		return "uint32"
	} else if value == "bool" {
		return "bool"
	} else if value == "string" {
		return "string"
	} else if value == "float32" {
		return "float"
	} else if value == "float64" ||
		value == "complex64" ||
		value == "complex128" {
		return "double"
	} else if value == "[]byte" {
		return "bytes"
	}
	return value
}

func GetSqliteDataType(fieldMetadata corenode.FieldMetadata) string {
	// if the field is an array, then the data type is TEXT
	if fieldMetadata.IsArray {
		return "TEXT"
	}
	value := fieldMetadata.Type
	if value == "int" ||
		value == "int16" ||
		value == "int32" ||
		value == "int64" ||
		value == "uint8" ||
		value == "uint16" ||
		value == "uint32" ||
		value == "uint64" ||
		value == "uint" ||
		value == "rune" ||
		value == "byte" ||
		value == "uintptr" ||
		value == "bool" {
		return "INTEGER"
	} else if value == "bool" {
		return "INTEGER"
	} else if value == "float32" ||
		value == "float64 " ||
		value == "complex64" ||
		value == "complex128" {
		return "REAL"
	} else if value == "string" {
		return "TEXT"
	}
	return "TEXT"
}

func GetMySQLDataType(fieldMetadata corenode.FieldMetadata) string {
	// if the field is an array, then the data type is VARCHAR(100)
	if fieldMetadata.IsArray {
		return "VARCHAR(100)"
	}
	value := fieldMetadata.Type
	if value == "int" ||
		value == "int16" ||
		value == "int32" ||
		value == "int64" ||
		value == "uint8" ||
		value == "uint16" ||
		value == "uint32" ||
		value == "uint64" ||
		value == "uint" ||
		value == "rune" ||
		value == "byte" ||
		value == "uintptr" {
		return "INT"
	} else if value == "bool" {
		return "BOOL"
	} else if value == "float32" ||
		value == "float64 " {
		return "FLOAT"
	} else if value == "complex64" ||
		value == "complex128" {
		return "DOUBLE"
	} else if value == "string" {
		return "VARCHAR(100)"
	}
	return "VARCHAR(100)"
}

func GetDefaultValueForDataType(value string) interface{} {
	if value == "int" ||
		value == "int16" ||
		value == "int32" ||
		value == "int64" ||
		value == "uint8" ||
		value == "uint16" ||
		value == "uint32" ||
		value == "uint64" ||
		value == "uint" ||
		value == "rune" ||
		value == "byte" ||
		value == "uintptr" {
		return 1
	} else if value == "bool" {
		return true
	} else if value == "float32" ||
		value == "float64" ||
		value == "complex64" ||
		value == "complex128" {
		return 1.0
	} else if value == "string" {
		return "sample string"
	}

	return "defaultValue"
}
