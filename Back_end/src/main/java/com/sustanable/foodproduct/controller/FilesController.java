package com.sustanable.foodproduct.controller;


import com.sustanable.foodproduct.dtos.FileResponse;
import com.sustanable.foodproduct.services.MinioService;
import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/files")
@RequiredArgsConstructor
public class FilesController {
    private static final Logger LOGGER = LogManager.getLogger(FilesController.class);

    private final MinioService minioService;

    @PostMapping("/upload/client/files")
    public List<FileResponse> uploadFiles(final MultipartFile[] files) {
        return minioService.uploadMultiFiles(files);
    }
}
