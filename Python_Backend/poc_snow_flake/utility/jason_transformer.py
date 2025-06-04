from typing import List, Dict, Any

class JsonTransformer:
    def __init__(self, base_package: str = "com.codegen.model"):
        self.base_package = base_package

    def transform(self, input_json: Dict[str, Any]) -> Dict[str, Any]:
        """
        Transforms Python JSON input into Java API expected format.

        Args:
            input_json (dict): Input JSON containing 'tableName' and 'fields' keys.

        Returns:
            dict: Transformed JSON with 'className' and 'fields' keys.
        """
        table_name = input_json.get("tableName", "DefaultClass").strip()

        # Compose full Java class name with package prefix
        class_name = f"{self.base_package}.{table_name}"

        fields = input_json.get("fields", [])
        transformed_fields = self._transform_fields(fields)

        return {
            "className": class_name,
            "fields": transformed_fields
        }

    def _transform_fields(self, fields: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        transformed = []

        for field in fields:
            column = field.get("column", {})
            name = column.get("label", "").strip()
            if not name:
                continue

            # Use 'type' from field if present, else fallback to column.type or default to 'String'
            field_type = field.get("type") or column.get("type") or "String"
            # Ensure 'primary' is boolean, default False
            primary = bool(field.get("primary", False))

            transformed.append({
                "name": name,
                "type": field_type,
                "primary": primary
            })

        return transformed

    @staticmethod
    def test():
        example_input = {
            "tableName": "ihnji",
            "fields": [
                {"column": {"label": "inni", "type": "Double"}, "type": "Double", "primary": True},
                {"column": {"label": "knkkin", "type": "String"}, "type": "String"},
                {"column": {"label": "knmkn ", "type": "String"}, "type": "String"}
            ],
            "menuName": "someMenu"
        }

        transformer = JsonTransformer()
        output = transformer.transform(example_input)
        print("Transformed JSON:")
        import json
        print(json.dumps(output, indent=2))


if __name__ == "__main__":
    JsonTransformer.test()
