package com.example.auto.controller;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.auto.repositories.RegisterRepository;
import com.example.auto.repositories.UserRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import jakarta.servlet.http.HttpServletRequest;

@CrossOrigin("*")
@RestController
@RequestMapping("/master")
public class UserController {
	
	private static final Logger log = LoggerFactory.getLogger(UserController.class);

	@Autowired
    private UserRepository userRepository;
	

    // Helper function to return consistent responses
    private ResponseEntity<Object> makeResponse(Object data, int status_code) {
        return ResponseEntity.status(status_code).body(data);
    }

    @PostMapping("/user")
    public ResponseEntity<Object> createUser(@RequestBody Object data) {
        try {
            Object response = userRepository.createUser((Map<String, Object>) data);
            return makeResponse(response, 200);
        } catch (Exception e) {
            return makeResponse("Error: " + e.getMessage(), 500);
        }
    }

	
	  @GetMapping("/user") public ResponseEntity<Object>
	  getUser(@RequestParam(required = false) String id) { try { if (id != null) {
	  Object response = userRepository.getUser(id); return makeResponse(response, 200); } else {
	  Object response = userRepository.getAllUsers(); return makeResponse(response, 200); } }
	  catch (Exception e) { return makeResponse("Error: " + e.getMessage(), 500); }
	  }
	 

    @PutMapping("/user")
    public ResponseEntity<Object> updateUser(@RequestParam String id, @RequestBody Object data) {
        try {
            Object response = userRepository.updateUser(id, (Map<String, Object>) data);
            return makeResponse(response, 200);
        } catch (Exception e) {
            return makeResponse("Error: " + e.getMessage(), 500);
        }
    }

    @DeleteMapping("/user")
    public ResponseEntity<Object> deleteUser(@RequestParam String id) {
        try {
            Object response = userRepository.deleteUser(id);
            return makeResponse(response, 200);
        } catch (Exception e) {
            return makeResponse("Error: " + e.getMessage(), 500);
        }
    }

	
	  @GetMapping("/Allusers") public ResponseEntity<Object> getAllUsers() { try {
	  Object users = userRepository.fetchAllUsers(); 
	  return makeResponse(users, 200); } catch
	  (Exception e) { return makeResponse("Error: " + e.getMessage(), 500); } }
	 

    @PostMapping("/menu")
    public ResponseEntity<Object> createMenu(@RequestBody Object data) {
        try {
            Object result = userRepository.createMenu((Map<String, Object>) data);
            return makeResponse(result, 200);
        } catch (Exception e) {
            return makeResponse("Error: " + e.getMessage(), 500);
        }
    }

	
	  @GetMapping("/menu") public ResponseEntity<Object>
	  getMenu(@RequestParam(required = false) String id) { 
		  try {
			  if (id != null) {
	  Object result = userRepository.getMenu(id);
	  return makeResponse(result, 200); 
	  } else {
		  List<Map<String, Object>> result = userRepository.getAllMenus(); 
		  return makeResponse(result, 200); 
		  } 
			  } catch (Exception e) {
				  return makeResponse("Error: " + e.getMessage(), 500); }
		  }
	 

    @PutMapping("/menu")
    public ResponseEntity<Object> updateMenu(@RequestParam String id, @RequestBody Object data) {
        try {
            Object result = userRepository.updateMenu(id, (Map<String, Object>) data);
            return makeResponse(result, 200);
        } catch (Exception e) {
            return makeResponse("Error: " + e.getMessage(), 500);
        }
    }

    @DeleteMapping("/menu")
    public ResponseEntity<Object> deleteMenu(@RequestParam String id) {
        try {
            Object result = userRepository.deleteMenu(id);
            return makeResponse(result, 200);
        } catch (Exception e) {
            return makeResponse("Error: " + e.getMessage(), 500);
        }
    }

    @PostMapping("/submenu")
    public ResponseEntity<Object> createSubMenu(@RequestBody Object data) {
        try {
            Object result = userRepository.createSubMenu((Map<String, Object>) data);
            return makeResponse(result, 200);
        } catch (Exception e) {
            return makeResponse("Error: " + e.getMessage(), 500);
        }
    }

	
	  @GetMapping("/submenu") public ResponseEntity<Object>
	  getSubMenu(@RequestParam(required = false) String id) { try { if (id != null)
	  { Object result = userRepository.getSubMenu(id); return makeResponse(result, 200); } else {
		  List<Map<String, Object>> result = userRepository.getAllSubMenus(); return makeResponse(result, 200); } } catch
	  (Exception e) { return makeResponse("Error: " + e.getMessage(), 500); } }
	 

    @PutMapping("/submenu")
    public ResponseEntity<Object> updateSubMenu(@RequestParam String id, @RequestBody Object data) {
        try {
            Object result = userRepository.updateSubMenu(id, (Map<String, Object>) data);
            return makeResponse(result, 200);
        } catch (Exception e) {
            return makeResponse("Error: " + e.getMessage(), 500);
        }
    }

    @DeleteMapping("/submenu")
    public ResponseEntity<Object> deleteSubMenu(@RequestParam String id) {
        try {
            Object result = userRepository.deleteSubMenu(id);
            return makeResponse(result, 200);
        } catch (Exception e) {
            return makeResponse("Error: " + e.getMessage(), 500);
        }
    }



 // POST: Create a new permission
    @PostMapping("/permission")
    public ResponseEntity<Map<String, Object>> createPermission(@RequestBody Map<String, Object> data) {
        try {
            Map<String, Object> response = userRepository.createPermission(data);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // GET: Get a specific permission or all permissions
    @GetMapping("/permission")
    public ResponseEntity<Object> getPermissions(@RequestParam(required = false) String id) {
        try {
           
            if (id != null) {
            	 Map<String, Object> response = userRepository.getPermission(id);
            	 return makeResponse(response, 200); 
            } else {
            	 List<Map<String, Object>> response = userRepository.getAllPermissions();
            	 return makeResponse(response, 200); 
            }
          
        } catch (Exception e) {
            return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // PUT: Update a permission
    @PutMapping("/permission")
    public ResponseEntity<Map<String, Object>> updatePermission(
            @RequestParam String id, @RequestBody Map<String, Object> data) {
        try {
            Map<String, Object> response = userRepository.updatePermission(id, data);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // DELETE: Delete a permission
    @DeleteMapping("/permission")
    public ResponseEntity<Map<String, Object>> deletePermission(@RequestParam String id) {
        try {
            Map<String, Object> response = userRepository.deletePermission(id);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

 // POST method to create a new role permission
    @PostMapping("/rolePermission")
    public ResponseEntity<Map<String, Object>> createRolePermission(@RequestBody Map<String, Object> data) {
        Map<String, Object> response = userRepository.createRolePermission(data);
        int statusCode = (int) response.get("status");
        return new ResponseEntity<>(response, HttpStatus.valueOf(statusCode));
    }

    // GET method to retrieve role permission by ID or all role permissions
    @GetMapping("/rolePermission")
    public ResponseEntity<Object> getRolePermission(@RequestParam(value = "id", required = false) String rolePermissionId) {
       
        int statusCode;
        try {
        if (rolePermissionId != null) {
        	 Map<String, Object> response = userRepository.getRolePermission(rolePermissionId);
        	 return makeResponse(response, 200); 
        } else {
        	 List<Map<String, Object>> response = userRepository.getAllRolePermissions();
        	 return makeResponse(response, 200); 
        }

    } catch (Exception e) {
        return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
    }
    }

    // PUT method to update role permission
    @PutMapping("/rolePermission")
    public ResponseEntity<Map<String, Object>> updateRolePermission(
            @RequestParam(value = "id") String rolePermissionId, 
            @RequestBody Map<String, Object> data) {
        
        Map<String, Object> response = userRepository.updateRolePermission(rolePermissionId, data);
        int statusCode = (int) response.get("status");
        return new ResponseEntity<>(response, HttpStatus.valueOf(statusCode));
    }

    // DELETE method to delete role permission
    @DeleteMapping("/rolePermission")
    public ResponseEntity<Map<String, Object>> deleteRolePermission(@RequestParam(value = "id") String rolePermissionId) {
        Map<String, Object> response = userRepository.deleteRolePermission(rolePermissionId);
        int statusCode = (int) response.get("status");
        return new ResponseEntity<>(response, HttpStatus.valueOf(statusCode));
    }

    @PostMapping("/tableConfigurator")
    public ResponseEntity<String> configureTable(@RequestBody Map<String, Object> data) {
        try {
            String response = userRepository.createTable(data);
            return ResponseEntity.status(200).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @GetMapping("/tableConfigurator")
    public ResponseEntity<String> getDataType(@RequestParam(value = "type", required = false) String paramType) {
        if ("dataType".equals(paramType)) {
            try {
                String response = userRepository.getDataType();
                return ResponseEntity.status(200).body(response);
            } catch (Exception e) {
                return ResponseEntity.status(500).body("{\"error\": \"" + e.getMessage() + "\"}");
            }
        }
        return ResponseEntity.status(400).body("{\"error\": \"Invalid request parameter\"}");
    }

    
	// Clients
	@GetMapping("/AllClients")
	public ResponseEntity<Object> getAllClients() throws SQLException {
		List<Map<String, Object>> roles = userRepository.getClients();
		return new ResponseEntity<>(roles, HttpStatus.OK);
	}

	@PostMapping("/createClient")
	public ResponseEntity<Object> createClients(@RequestBody Map<String, Object> data) throws SQLException {
		try {
			Map<String, Object> response = userRepository.createClients(data);
			return new ResponseEntity<>(response, HttpStatus.CREATED);
		} catch (Exception e) {
			return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@PutMapping("/updateClient")
	public ResponseEntity<Map<String, Object>> updateClient(@RequestParam(value = "id") String id,
			@RequestBody Map<String, Object> data) {

		Map<String, Object> response = userRepository.updateClient(id, data);
		int statusCode = (int) response.get("status");
		return new ResponseEntity<>(response, HttpStatus.valueOf(statusCode));
	}

	@DeleteMapping("/deleteClientById")
	public ResponseEntity<Map<String, Object>> deleteClientById(@RequestParam(value = "id") String rolePermissionId) {
		Map<String, Object> response = userRepository.deleteClientById(rolePermissionId);
		int statusCode = (int) response.get("status");
		return new ResponseEntity<>(response, HttpStatus.valueOf(statusCode));
	}
	
	
	
	//Project Types
	@GetMapping("/AllProjectTypes")
	public ResponseEntity<Object> getAllProjects() throws SQLException {
		List<Map<String, Object>> roles = userRepository.getProjectTypes();
		return new ResponseEntity<>(roles, HttpStatus.OK);
	}

	
	@PostMapping("/createProjectType")
	public ResponseEntity<Object> createProjectType(@RequestBody Map<String, Object> data) throws SQLException {
		try {
			Map<String, Object> response = userRepository.createProjectType(data);
			return new ResponseEntity<>(response, HttpStatus.CREATED);
		} catch (Exception e) {
			return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	

	@PutMapping("/updateProjectType")
	public ResponseEntity<Map<String, Object>> updateProjectType(@RequestParam(value = "id") String id,
			@RequestBody Map<String, Object> data) {

		Map<String, Object> response = userRepository.updateProjectType(id, data);
		int statusCode = (int) response.get("status");
		return new ResponseEntity<>(response, HttpStatus.valueOf(statusCode));
	}
	
	
	@DeleteMapping("/deleteProjectType")
	public ResponseEntity<Map<String, Object>> deleteProjectType(
			@RequestParam(value = "id") String rolePermissionId) {
		Map<String, Object> response = userRepository.deleteProjectType(rolePermissionId);
		int statusCode = (int) response.get("status");
		return new ResponseEntity<>(response, HttpStatus.valueOf(statusCode));
	}
	
	
	
	
	
	
	//Project Roles
	
	@GetMapping("/AllProjectRoles")
	public ResponseEntity<Object> getAllProjectRoles() throws SQLException {
		List<Map<String, Object>> roles = userRepository.getAllProjectRoles();
		return new ResponseEntity<>(roles, HttpStatus.OK);
	}
	
//	@PostMapping("/createProjectRole")
//	public ResponseEntity<Object> createProjectRole(@RequestBody Map<String, Object> data) throws SQLException {
//		try {
//			Map<String, Object> response = userRepository.createProjectRole(data);
//			return new ResponseEntity<>(response, HttpStatus.CREATED);
//		} catch (Exception e) {
//			return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
//		}
//	}
	
	
	
	
	
	
	//Project Phases

	@GetMapping("/AllProjectPhases")
	public ResponseEntity<Object> getAllProjectPhases() throws SQLException {
		List<Map<String, Object>> roles = userRepository.getAllProjectPhases();
		return new ResponseEntity<>(roles, HttpStatus.OK);
	}
	
	
	
	
	

	// Project creation

	@GetMapping("/AllProjectCreation")
	public ResponseEntity<Object> getAllProjectCreation() throws SQLException {
		List<Map<String, Object>> roles = userRepository.getAllProjectCreation();
		return new ResponseEntity<>(roles, HttpStatus.OK);
	}

	@PostMapping("/AllProjectCreation")
	public ResponseEntity<Map<String, Object>> createAllProjectCreation(@RequestBody Map<String, Object> data) {
		try {
			Map<String, Object> response = userRepository.createAllProjectCreation(data);
			return new ResponseEntity<>(response, HttpStatus.CREATED);
		} catch (Exception e) {
			return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@PutMapping("/AllProjectCreation")
	public ResponseEntity<Map<String, Object>> updateAllProjectCreation(@RequestParam(value = "id") String id,
			@RequestBody Map<String, Object> data) {

		Map<String, Object> response = userRepository.updateAllProjectCreation(id, data);
		int statusCode = (int) response.get("status");
		return new ResponseEntity<>(response, HttpStatus.valueOf(statusCode));
	}

	@DeleteMapping("/AllProjectCreation")
	public ResponseEntity<Map<String, Object>> deleteProjectDetail(
			@RequestParam(value = "id") String rolePermissionId) {
		Map<String, Object> response = userRepository.deleteProjectDetails(rolePermissionId);
		int statusCode = (int) response.get("status");
		return new ResponseEntity<>(response, HttpStatus.valueOf(statusCode));
	}


	
	
	// Project Estimation

	@GetMapping("/getAllProjectEst")
	public ResponseEntity<Object> getAllProjectEst() throws SQLException {
		List<Map<String, Object>> roles = userRepository.getAllProjectEst();
		return new ResponseEntity<>(roles, HttpStatus.OK);
	}

	@PostMapping("/CreateProjectEst")
	public ResponseEntity<Map<String, Object>> createProjectEst(@RequestBody Map<String, Object> data) {
		try {
			Map<String, Object> response = userRepository.createProjectEst(data);
			return new ResponseEntity<>(response, HttpStatus.CREATED);
		} catch (Exception e) {
			return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@PutMapping("/getAllProjectEst")
	public ResponseEntity<Map<String, Object>> updategetAllProjectEst(@RequestParam(value = "id") String id,
			@RequestBody Map<String, Object> data) {

		Map<String, Object> response = userRepository.updategetAllProjectEst(id, data);
		int statusCode = (int) response.get("status");
		return new ResponseEntity<>(response, HttpStatus.valueOf(statusCode));
	}

	@DeleteMapping("/DeleteProjectEstById")
	public ResponseEntity<Map<String, Object>> deleteProjectEstById(
			@RequestParam(value = "id") String rolePermissionId) {
		Map<String, Object> response = userRepository.deleteProjectEstById(rolePermissionId);
		int statusCode = (int) response.get("status");
		return new ResponseEntity<>(response, HttpStatus.valueOf(statusCode));
	}

	@GetMapping("/AllActivityCodes")
	public ResponseEntity<Object> getAllActivityCodes(@RequestParam(value = "phaseId") String phaseId,
			@RequestParam(value = "projectRoleId") int projectRoleId) throws SQLException {
		List<Map<String, Object>> roles = userRepository.getAllActivityCodes(phaseId, projectRoleId);
		return new ResponseEntity<>(roles, HttpStatus.OK);
	}
	
	@GetMapping("/GetActivityCodes")
	public ResponseEntity<Object> getAllActivityCodes() throws SQLException {
		List<Map<String, Object>> roles = userRepository.getActivityCodes();
		return new ResponseEntity<>(roles, HttpStatus.OK);
	}
}
