package org.smarttrainer.backend.modules.programme.mapper;

import org.smarttrainer.backend.domain.programme.Programme;
import org.smarttrainer.backend.modules.programme.dto.ProgrammeRequest;
import org.smarttrainer.backend.modules.programme.dto.ProgrammeResponse;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ProgrammeMapper {

    public ProgrammeResponse toResponse(Programme programme) {
        return ProgrammeResponse.builder()
                .id(programme.getId())
                .createdAt(programme.getCreatedAt())
                .title(programme.getTitle())
                .description(programme.getDescription())
                .duration(programme.getDuration())
                .level(programme.getLevel())
                .objective(programme.getObjective())
                .isGeneratedByAI(programme.getIsGeneratedByAI() != null ? programme.getIsGeneratedByAI() : false)
                .isValidatedByCoach(programme.getIsValidatedByCoach() != null ? programme.getIsValidatedByCoach() : false)
                .coachId(programme.getCoach().getId())
                .coachName(programme.getCoach().getUser().fullName())
                .exerciseIds(
                        programme.getExercises() == null ? List.of()
                                : programme.getExercises().stream()
                                .map(e -> e.getId())
                                .collect(Collectors.toList())
                )
                // Clients Programme
                .clientIds(
                        programme.getClients() == null ? List.of()
                                : programme.getClients().stream()
                                .map(c -> c.getId())
                                .collect(Collectors.toList())
                )
                .build();
    }

    public Programme toEntity(ProgrammeRequest request) {
        Programme programme = new Programme();
        programme.setTitle(request.getTitle());
        programme.setDescription(request.getDescription());
        programme.setDuration(request.getDuration());
        programme.setLevel(request.getLevel());
        programme.setObjective(request.getObjective());
        programme.setIsGeneratedByAI(request.isGeneratedByAI());
        programme.setIsValidatedByCoach(false); // always false on creation
        return programme;
    }
}