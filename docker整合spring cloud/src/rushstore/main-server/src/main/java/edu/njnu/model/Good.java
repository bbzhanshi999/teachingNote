package edu.njnu.model;

public class Good {

    private Long id;
    private String goodName;
    private Double goodPrice;
    private String goodDetail;
    private Integer repoCount;
    private Integer casVersion;

    // alt + insert

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getGoodName() {
        return goodName;
    }

    public void setGoodName(String goodName) {
        this.goodName = goodName;
    }

    public Double getGoodPrice() {
        return goodPrice;
    }

    public void setGoodPrice(Double goodPrice) {
        this.goodPrice = goodPrice;
    }

    public String getGoodDetail() {
        return goodDetail;
    }

    public void setGoodDetail(String goodDetail) {
        this.goodDetail = goodDetail;
    }

    public Integer getRepoCount() {
        return repoCount;
    }

    public void setRepoCount(Integer repoCount) {
        this.repoCount = repoCount;
    }

    public Integer getCasVersion() {
        return casVersion;
    }

    public void setCasVersion(Integer casVersion) {
        this.casVersion = casVersion;
    }
}
