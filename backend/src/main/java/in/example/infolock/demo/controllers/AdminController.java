package in.example.infolock.demo.controllers;

import in.example.infolock.demo.dto.DocumentDTO;
import in.example.infolock.demo.dto.UserDTO;
import in.example.infolock.demo.entity.UserEntity;
import in.example.infolock.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    // Convert UserEntity to UserDTO
    private UserDTO convertToUserDTO(UserEntity user) {
        List<DocumentDTO> documentDTOs = user.getDocuments().stream()
                .map(this::convertToDocumentDTO)
                .collect(Collectors.toList());

        return UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .documents(documentDTOs)
                .build();
    }

    // Convert Document to DocumentDTO
    private DocumentDTO convertToDocumentDTO(in.example.infolock.demo.entity.Document document) {
        return DocumentDTO.builder()
                .id(document.getId())
                .fileName(document.getFileName())
                .fileType(document.getFileType())
                .category(document.getCategory())
                .fileSize(document.getFileSize())
                .uploadDate(document.getUploadDate())
                .build();
    }

    // Get all users with DTO conversion
    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        try {
            List<UserEntity> users = userRepository.findAll();

            // Convert entities to DTOs
            List<UserDTO> userDTOs = users.stream()
                    .map(this::convertToUserDTO)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(userDTOs);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Get single user by ID with DTO conversion
    @GetMapping("/users/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        try {
            Optional<UserEntity> userOptional = userRepository.findById(id);

            if (userOptional.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            UserDTO userDTO = convertToUserDTO(userOptional.get());
            return ResponseEntity.ok(userDTO);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Delete a user by ID
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            Optional<UserEntity> userOptional = userRepository.findById(id);

            if (userOptional.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            userRepository.deleteById(id);
            return ResponseEntity.ok().body("User with ID " + id + " deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error deleting user: " + e.getMessage());
        }
    }
}