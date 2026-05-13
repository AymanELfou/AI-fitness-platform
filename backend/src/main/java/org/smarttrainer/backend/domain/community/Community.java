package org.smarttrainer.backend.domain.community;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.smarttrainer.backend.domain.club.ClubProfile;
import org.smarttrainer.backend.domain.commun.BaseEntity;

@Entity
@Table(name = "community")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Community extends BaseEntity {

    private String name;
    private String description;

    @OneToOne
    @JoinColumn(name="club_id",nullable = false)
    private ClubProfile club;

}
