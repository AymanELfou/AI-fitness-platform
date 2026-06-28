package org.smarttrainer.backend.domain.exercice;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.smarttrainer.backend.domain.commun.BaseEntity;
import org.smarttrainer.backend.domain.programme.Programme;

import java.util.List;

@Entity
@Table(name = "exercise")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Exercise extends BaseEntity {

    private String name;
    @Column(columnDefinition = "TEXT")
    private String description;
    private String musclesGroup;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Difficulty difficulty;
    private int series;
    private int repetition;
    private int duration;
    private int calories;
    //image must be TEXT
    @Column(columnDefinition = "TEXT")
    private String imageUrl;

    @ManyToMany(mappedBy = "exercises")
    private List<Programme> programmes;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CreatedByRole createdByRole;
}
