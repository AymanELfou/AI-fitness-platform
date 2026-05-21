package org.smarttrainer.backend.modules.client.dto;

import lombok.Data;

@Data
public class ClientProfileRequest {

    private int age;
    private Double poids;
    private Double taille;
    private String but;
    private String niveau;

}
