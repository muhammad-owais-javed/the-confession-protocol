package com.protocol.confession.dto;

public class ConditionalResponse {

    private StatCondition condition;
    private String subjectDialogueOverride;

    public ConditionalResponse() {
    }

    public ConditionalResponse(StatCondition condition, String subjectDialogueOverride) {
        this.condition = condition;
        this.subjectDialogueOverride = subjectDialogueOverride;
    }

    public StatCondition getCondition() {
        return condition;
    }

    public String getSubjectDialogueOverride() {
        return subjectDialogueOverride;
    }

    public void setCondition(StatCondition condition) {
        this.condition = condition;
    }

    public void setSubjectDialogueOverride(String subjectDialogueOverride) {
        this.subjectDialogueOverride = subjectDialogueOverride;
    }  

    public static class StatCondition {

        private String stat;
        private String operator;
        private Integer value;

        public StatCondition(){

    }

    public StatCondition(String stat, String operator, Integer value) {
            this.stat = stat;
            this.operator = operator;
            this.value = value;
        }

        public String getStat() {
            return stat;
        }

        public String getOperator() {
            return operator;
        }

        public Integer getValue() {
            return value;
        }

        public void setStat(String stat) {
            this.stat = stat;
        }

        public void setOperator(String operator) {
            this.operator = operator;
        }

        public void setValue(Integer value) {
            this.value = value;
        }

        public boolean isMet(java.util.Map<String, Integer> currentStats) {
            Integer currentValue = currentStats.getOrDefault(stat, 0);

            switch (operator) {
                case ">":
                    return currentValue > value;
                case "<":
                    return currentValue < value;
                case ">=":
                    return currentValue >= value;
                case "<=":
                    return currentValue <= value;
                case "==":
                    return currentValue.equals(value);
                case "!=":
                    return !currentValue.equals(value);
                default:
                    return false;
            }


        }
    }
}


    

    

