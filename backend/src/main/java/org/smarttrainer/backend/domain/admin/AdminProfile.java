package org.smarttrainer.backend.domain.admin;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.smarttrainer.backend.domain.commun.BaseEntity;
import org.smarttrainer.backend.domain.user.User;

@Entity
@Table(name = "admin_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AdminProfile extends BaseEntity {

    @OneToOne
    @JoinColumn(name = "user_id",nullable = false, updatable = true)
    private User user;

    private String permissions;
}
