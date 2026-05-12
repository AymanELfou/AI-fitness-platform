package org.smarttrainer.backend.domain.seance;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.smarttrainer.backend.domain.client.ClientProfile;
import org.smarttrainer.backend.domain.coach.CoachProfile;
import org.smarttrainer.backend.domain.commun.BaseEntity;

import java.util.List;

@Entity
@Table(name = "seance")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Seance extends BaseEntity {

    private String statut;
    private int duration;
    private String notes;

    @ManyToMany(mappedBy = "seances")
    private List<ClientProfile> clients;

    @ManyToOne
    @JoinColumn(name = "coach_id")
    private CoachProfile coach;
}
