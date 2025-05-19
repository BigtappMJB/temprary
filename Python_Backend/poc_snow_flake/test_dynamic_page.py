import requests
import json

# Test the dynamic page creation API
def test_create_dynamic_page():
    url = "http://localhost:5000/dynamic-page/create"
    
    payload = {
        "tableName": "clients",
        "menuName": "Client Management",
        "subMenuName": "Clients",
        "pageName": "ClientPage",
        "routePath": "/clients",
        "moduleName": "client",
        "permissionLevels": ["create", "read", "update", "delete"]
    }
    
    headers = {
        "Content-Type": "application/json"
    }
    
    response = requests.post(url, json=payload, headers=headers)
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")

if __name__ == "__main__":
    test_create_dynamic_page()