package org.smarttrainer.backend.domain.config;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Builder
@Table(name="system_config")
public class SystemConfig {

    @Id
    @GeneratedValue
    private Long id;
    
    private boolean maintenanceMode;
}
