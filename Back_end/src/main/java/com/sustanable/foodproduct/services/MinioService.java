package com.sustanable.foodproduct.services;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.sustanable.foodproduct.dtos.FileResponse;

public interface MinioService {
    List<FileResponse> uploadMultiFiles(MultipartFile[] multipartFile);

    /**
     * Upload a single file and return the file response
     * 
     * @param file the file to upload
     * @return FileResponse containing file information
     */
    FileResponse uploadSingleFile(MultipartFile file);
}
