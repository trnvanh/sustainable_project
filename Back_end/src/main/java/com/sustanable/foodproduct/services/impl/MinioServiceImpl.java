package com.sustanable.foodproduct.services.impl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.sustanable.foodproduct.dtos.FileResponse;
import com.sustanable.foodproduct.feign.OutboundUploadMultiFiles;
import com.sustanable.foodproduct.services.MinioService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MinioServiceImpl implements MinioService {

    private final OutboundUploadMultiFiles outboundUploadMultiFiles;

    @Override
    public List<FileResponse> uploadMultiFiles(final MultipartFile[] multipartFile) {
        return outboundUploadMultiFiles.uploadMultipleFiles(multipartFile);
    }

    @Override
    public FileResponse uploadSingleFile(MultipartFile file) {
        MultipartFile[] files = new MultipartFile[] { file };
        List<FileResponse> responses = uploadMultiFiles(files);

        if (responses.isEmpty()) {
            throw new RuntimeException("Failed to upload file: No response received");
        }

        return responses.get(0);
    }
}
