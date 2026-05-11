package org.smarttrainer.backend.domain.seance;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.smarttrainer.backend.domain.commun.BaseEntity;

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

}
