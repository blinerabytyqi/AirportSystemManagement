package com.projekti;

public class Flight {

    private int id;
    private String fname;
    private String dcity;
    private String acity;
    private String ddate;
    private String adate;
    private String price;    

    public Flight(int id, String fname, String dcity, String acity, String ddate, String adate, String price) {
        this.id = id;
        this.fname = fname;
        this.dcity = dcity;
        this.acity = acity;
        this.ddate = ddate;
        this.adate = adate;
        this.price = price;
    }

    public int getId() {
        return this.id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getFname() {
        return this.fname;
    }

    public void setFname(String fname) {
        this.fname = fname;
    }

    public String getDcity() {
        return this.dcity;
    }

    public void setDcity(String dcity) {
        this.dcity = dcity;
    }

    public String getAcity() {
        return this.acity;
    }

    public void setAcity(String acity) {
        this.acity = acity;
    }

    public String getDdate() {
        return this.ddate;
    }

    public void setDdate(String ddate) {
        this.ddate = ddate;
    }

    public String getAdate() {
        return this.adate;
    }

    public void setAdate(String adate) {
        this.adate = adate;
    }

    public String getPrice() {
        return this.price;
    }

    public void setPrice(String price) {
        this.price = price;
    }

}