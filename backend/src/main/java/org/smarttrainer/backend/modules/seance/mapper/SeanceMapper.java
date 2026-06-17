package org.smarttrainer.backend.modules.seance.mapper;

import org.smarttrainer.backend.domain.seance.Seance;
import org.smarttrainer.backend.modules.seance.dto.SeanceRequest;
import org.smarttrainer.backend.modules.seance.dto.SeanceResponse;
import org.springframework.stereotype.Component;

@Component
public class SeanceMapper {

    public SeanceResponse toResponse(Seance seance) {
        return SeanceResponse.builder()
                .id(seance.getId())
                .createdAt(seance.getCreatedAt())
                .status(seance.getStatus())
                .duration(seance.getDuration())
                .notes(seance.getNotes())
                .coachId(seance.getCoach() != null ? seance.getCoach().getId() : null)
                .coachName(seance.getCoach() != null ? seance.getCoach().getUser().fullName() : null)
                .programmeId(seance.getProgramme() != null ? seance.getProgramme().getId() : null)
                .programmeTitle(seance.getProgramme() != null ? seance.getProgramme().getTitle() : null)
                .build();
    }

    public Seance toEntity(SeanceRequest request) {
        Seance seance = new Seance();
        seance.setStatus(request.getStatus());
        seance.setDuration(request.getDuration());
        seance.setNotes(request.getNotes());
        return seance;
    }
}