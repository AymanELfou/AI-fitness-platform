package org.smarttrainer.backend.domain.programme;

import jakarta.persistence.*;
import lombok.*;
import org.smarttrainer.backend.domain.client.ClientProfile;
import org.smarttrainer.backend.domain.coach.CoachProfile;
import org.smarttrainer.backend.domain.commun.BaseEntity;
import org.smarttrainer.backend.domain.exercice.Exercise;
import org.smarttrainer.backend.domain.seance.Seance;

import java.util.List;

@Entity
@Table(name = "programme")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Programme extends BaseEntity {

    private String title;
    private String description;
    private int duration;
    private String level;
    private String objective;
    private String isGeneratedByAI;

    @ManyToOne
    @JoinColumn(name = "coach_id",nullable = false)
    private CoachProfile coach;

    @ManyToMany
    @JoinTable(
            name = "programme_exercice",
            joinColumns = @JoinColumn(name = "programme_id"),
            inverseJoinColumns = @JoinColumn(name = "exercice_id")
    )
    private List<Exercise> exercises;

    @ManyToMany(mappedBy = "programmes")
    private List<ClientProfile> clients;

    @OneToMany(mappedBy = "programme")
    private List<Seance> seances;
}
