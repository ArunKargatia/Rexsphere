package com.ak.Rexsphere.repository;

import com.ak.Rexsphere.entity.Rec;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecRepository extends JpaRepository<Rec, Long> {

    List<Rec> findByCategory(String category);

}
