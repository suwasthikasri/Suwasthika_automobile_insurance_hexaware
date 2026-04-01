package com.hexaware.spring_automobile.util;

public class PremiumCalculator {

   
    public static double calculateBasePremium(double vehicleValue) {

        double rate = 0.03;   
        return vehicleValue * rate;
    }

   
    public static double applyAddons(double premium, boolean roadsideAssistance, boolean engineProtection) {

        if (roadsideAssistance) {
            premium += 500;
        }

        if (engineProtection) {
            premium += 1000;
        }

        return premium;
    }

}