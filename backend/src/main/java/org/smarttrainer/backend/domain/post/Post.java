package org.smarttrainer.backend.domain.post;

<<<<<<< HEAD
import jakarta.persistence.*;
=======
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
>>>>>>> iman
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.smarttrainer.backend.domain.commun.BaseEntity;
<<<<<<< HEAD
import org.smarttrainer.backend.domain.user.User;

import java.util.List;
=======
import org.smarttrainer.backend.domain.community.Community;
import org.smarttrainer.backend.domain.user.User;
>>>>>>> iman

@Entity
@Table(name = "post")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Post extends BaseEntity {

    private String content;

<<<<<<< HEAD
    @OneToMany(mappedBy = "community")
    private List<Post> posts;
=======
    @ManyToOne
    @JoinColumn(name = "community_id")
    private Community community;
>>>>>>> iman

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
