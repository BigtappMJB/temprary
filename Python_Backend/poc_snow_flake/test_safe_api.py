import requests
import json
import time

def test_safe_dynamic_page_create():
    url = "http://localhost:5001/safe-dynamic-page/create"
    
    # Complete payload with all required fields
    payload = {
        "tableName": "sample_table",
        "menuName": "creation",
        "subMenuName": "sampleNew1",
        "pageName": "Sample Table Page",
        "routePath": "/sample-table",
        "moduleName": "sample",
        "permissionLevels": ["create", "read", "update", "delete"]
    }
    
    headers = {
        "Content-Type": "application/json"
    }
    
    try:
        print(f"Sending request to {url} with payload: {json.dumps(payload, indent=2)}")
        response = requests.post(url, json=payload, headers=headers, timeout=30)
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")

def test_missing_fields():
    url = "http://localhost:5001/safe-dynamic-page/create"
    
    # Incomplete payload missing required fields
    payload = {
        "tableName": "sample_table",
        "menuName": "creation",
        "subMenuName": "sampleNew1"
        # Missing pageName, routePath, moduleName
    }
    
    headers = {
        "Content-Type": "application/json"
    }
    
    try:
        print(f"Testing with missing fields: {json.dumps(payload, indent=2)}")
        response = requests.post(url, json=payload, headers=headers, timeout=30)
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")

if __name__ == "__main__":
    # Wait for server to start
    print("Waiting for server to start...")
    time.sleep(2)
    
    # Test with missing fields first
    print("\n=== Testing with missing fields ===")
    test_missing_fields()
    
    # Then test with complete payload
    print("\n=== Testing with complete payload ===")
    test_safe_dynamic_page_create()