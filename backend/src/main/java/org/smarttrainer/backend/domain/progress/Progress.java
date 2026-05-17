package org.smarttrainer.backend.domain.progress;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.smarttrainer.backend.domain.client.ClientProfile;
import org.smarttrainer.backend.domain.commun.BaseEntity;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "progress")
public class Progress extends BaseEntity {

    private String performance;
    private Double muscleMasse;
    private Double fatMasse;

    @ManyToOne
    @JoinColumn(name = "client_id")
    private ClientProfile client;
}
