package com.example.auto.controller;

//RoleController.java

import org.springframework.web.bind.annotation.RestController;

import com.example.auto.entity.RoleModel;
import com.example.auto.repositories.RoleRepository;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.http.ResponseEntity;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;

@CrossOrigin("*")
@RestController
@RequestMapping("/role")
public class RoleController {

	@Autowired
	private RoleRepository roleRepository;

	@PostMapping("/roles")
	public ResponseEntity<Object> createRole(@RequestBody Map<String, String> data) throws SQLException {
		String name = data.get("name");
		String description = data.get("description");

		if (name == null || name.isEmpty()) {
			return new ResponseEntity<>(Map.of("error", "Role name is required"), HttpStatus.BAD_REQUEST);
		}

		int roleId = roleRepository.createRole(name, description);
		return new ResponseEntity<>(Map.of("id", roleId, "name", name, "description", description), HttpStatus.CREATED);
	}

	@GetMapping("/Allroles")
	public ResponseEntity<Object> getRoles() throws SQLException {
		List<Map<String, Object>> roles = roleRepository.getRoles();
		return new ResponseEntity<>(roles, HttpStatus.OK);
	}

	@GetMapping("/getroles/{id}")
	public ResponseEntity<Object> getRole(@PathVariable int id) throws SQLException {
		RoleModel role = new RoleModel();
		role = (RoleModel) roleRepository.getRole(id);
		if (role == null) {
			return new ResponseEntity<>(Map.of("error", "Role not found"), HttpStatus.NOT_FOUND);
		}
		return new ResponseEntity<>(role, HttpStatus.OK);
	}

	@PutMapping("/updaterole/{id}")
	public ResponseEntity<Object> updateRole(@PathVariable int id, @RequestBody Map<String, String> data)
			throws SQLException {
		String name = data.get("name");
		String description = data.get("description");

		int rowcount = roleRepository.updateRole(id, name, description);
		if (rowcount == 0) {
			return new ResponseEntity<>(Map.of("error", "Role not found"), HttpStatus.NOT_FOUND);
		}

		return new ResponseEntity<>(Map.of("message", "Role updated successfully"), HttpStatus.OK);
	}

	@DeleteMapping("/deleteroles/{id}")
	public ResponseEntity<Object> deleteRole(@PathVariable int id) throws SQLException {
		Map<String, Object> response = roleRepository.deleteRole(id);
		return new ResponseEntity<>(response, (HttpStatus) response.get("status"));
	}

//	@GetMapping("/Allpermission")
//	public ResponseEntity<Object> getPermission() throws SQLException {
//		List<Map<String, Object>> permissions = (List<Map<String, Object>>) new PermissionModel();
//		permissions = roleRepository.getAllPermissions();
//		return new ResponseEntity<>(permissions, HttpStatus.OK);
//	}
}
