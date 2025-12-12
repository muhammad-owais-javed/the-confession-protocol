package com.protocol.confession.dto;

public class StatModifier {

    private Integer denial;
    private Integer guilt;
    private Integer confusion;
    private Integer enlightenment;

    public StatModifier(){

    }

    public StatModifier(Integer denial, Integer guilt, Integer confusion, Integer enlightenmnet){

        this.denial = denial;
        this.guilt = guilt;
        this.confusion = confusion;
        this.enlightenment = enlightenmnet;
    }

    public Integer getDenial() {
        return denial;
    }

    public Integer getGuilt() {
        return guilt;
    }

    public Integer getConfusion() {
        return confusion;
    }

    public Integer getEnlightenment() {
        return enlightenment;
    }

    public void setDenial(Integer denial) {
        this.denial = denial;
    }

    public void setGuilt(Integer guilt) {
        this.guilt = guilt;
    }

    public void setConfusion(Integer confusion) {
        this.confusion = confusion;
    }

    public void setEnlightenment(Integer enlightenment) {
        this.enlightenment = enlightenment;
    }

    public void forEach(Object object) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'forEach'");
    }
    
    
}
