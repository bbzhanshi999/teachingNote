package edu.njnu.model;

public class UserInfo {

    private Long id;
    private String username;
    private String password;
    private Double comsuption;

    // 快速生成代码的快捷键： alt+insert
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Double getComsuption() {
        return comsuption;
    }

    public void setComsuption(Double comsuption) {
        this.comsuption = comsuption;
    }
}
