package com.sustanable.foodproduct.feign;


import com.sustanable.foodproduct.dtos.FileResponse;
import com.sustanable.foodproduct.feign.configs.UploadFilesFeignWithBasicAuthenticationConfig;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@FeignClient(name = "upload-minio-api", url = "${file.upload.url}", configuration = UploadFilesFeignWithBasicAuthenticationConfig.class)
public interface OutboundUploadMultiFiles {

    Logger logger = LogManager.getLogger(OutboundUploadMultiFiles.class);

    @PostMapping(value = "/minio/upload/files", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    List<FileResponse> uploadMultipleFiles(@RequestPart("files") final MultipartFile[] files);


}