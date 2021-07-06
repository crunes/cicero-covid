# Author: Charmaine Runes
# Project: Cicero x SSW Collaboration

library(tidyverse)
library(tidyr)
library(dplyr)
library(readr)
library(ggplot2)
library(scales)
library(stringr)
library(here)
library(zoo)
library(ggtext)
library(viridis)

ar2_data <- read_csv(here("data","AR (2) - Foia JAN 24 JAN 29 RANGE.csv"),
                     col_types = cols(.default = "c"))
ar3_data <- read_csv(here("data","AR (3) - AR (3).csv"),
                     col_types = cols(.default = "c"))
ar4_data <- read_csv(here("data", "AR (4) - FOIA FEB 9 FEB 12 RANGE.csv"), 
                     col_types = cols(.default = "c"))
ar5_data <- read_csv(here("data", "AR FOIA (5) - AR FOIA (5).csv"), 
                     col_types = cols(.default = "c"))
ar6_data <- read_csv(here("data", "AR (6) - FOIA jan 31 feb 6th range (1).csv"), 
                     col_types = cols(.default = "c"))
crosswalk <- read_csv(here("data", "cook_county_zip_city_crosswalk.csv"),
                           col_types = cols(.default = "c"))

colnames(ar2_data) <- c("zip", "date_time") # Are these first or second doses?
colnames(ar3_data) <- c("zip", "date_time") # Are these first or second doses?
colnames(ar4_data) <- c("zip", "date_time") # Note: these are SECOND doses (has extra row)
colnames(ar5_data) <- c("zip", "date_time") # Are these first or second doses?
colnames(ar6_data) <- c("zip", "date_time") # Note: these are FIRST doses (has extra row)
colnames(crosswalk) <- c("zip", "city", "empty")

# Clean up the data

crosswalk <- crosswalk %>% 
  select(zip, city)

# For the rest of the data
cleanData <- function(data, extraRow=FALSE) {
  if (extraRow) {
    data = data[-1,]
  }
  
  data.clean <- data %>% 
    separate(zip, c("zip", NA), sep="-", extra = "drop", fill = "right") %>% 
    separate(date_time, c("day.abb", "day", "month", "year", "time", "timezone"), sep=" ") %>% 
    mutate(month = match(month, month.abb),
           month = str_pad(month, width=2, pad="0"),
           day = str_pad(day, width=2, pad="0"),
           date = as.Date(str_c(year, month, day, sep="-"), "%Y-%m-%d"),
           zip  = substr(zip, 1, 5) # assumes that the first 5 numbers are correct, might want to revisit
    ) %>% 
    select(-timezone, -day.abb, -month, -year, -time) %>% 
    group_by(zip, date) %>% 
    summarize(vaccines = n())
  
  return (data.clean)
}

ar2_data.clean <- cleanData(ar2_data)
ar3_data.clean <- cleanData(ar3_data)
ar4_data.clean <- cleanData(ar4_data, extraRow=TRUE)
ar5_data.clean <- cleanData(ar5_data)
ar6_data.clean <- cleanData(ar6_data, extraRow=TRUE)

# Merge the data
full <- rbind(ar2_data.clean, ar3_data.clean, ar4_data.clean, ar5_data.clean, ar6_data.clean) %>% 
  merge(crosswalk) %>% 
  distinct() %>% 
  arrange(zip, date) 

# Look at just Cicero
cicero <- full %>% 
  filter(city == "Cicero")

ggplot(data=cicero, aes(date, vaccines)) +
  geom_bar(stat = "identity") 

# Look at all cities 
unique(full$city)

# How many total vacciones doses do we have in these datasets?
sum_doses <- sum(full.total$total) # 8496

# Compare cities total
full.total <- full %>% 
  group_by(city, date) %>% 
  summarize(total = sum(vaccines)) %>% 
  arrange(date, desc(total))

cicero_vs_other <- full.total %>% 
  mutate(cicero = case_when(city == "Cicero" ~ "Cicero",
                            city != "Cicero" ~ "Other",
                            is.na(city) ~ "NA")) %>% 
  group_by(cicero, date) %>% 
  summarize(total = sum(total)) %>% 
  arrange(cicero, date)

# Stacked 100 percent chart
ggplot(data=cicero_vs_other, 
       aes(date, total, fill=factor(cicero, levels=c("NA","Other", "Cicero")))) +
  geom_bar(position="fill", stat="identity") + 
  scale_fill_viridis(discrete = T, name="", direction=-1) +
  scale_y_continuous(labels = scales::percent_format(accuracy=1), 
                     breaks=seq(0, 1, 0.25)) +
  xlab("Date") + ylab("Percent of total doses that day, by city") +
  theme(
    axis.ticks = element_blank(),
    panel.grid.major.y = element_line(size=0.5, linetype="dotted", colour ="lightgrey"),
    panel.grid.major.x = element_blank(),
    panel.grid.minor = element_blank(),
    panel.border = element_blank(),
    panel.background = element_rect(fill = "white", colour = "white"))

# Stack allow day-by-day variance
ggplot(data=cicero_vs_other, 
       aes(date, total, fill=factor(cicero, levels=c("NA","Other", "Cicero")))) +
  geom_bar(position="stack", stat="identity") + 
  scale_fill_viridis(discrete = T, name="", direction=-1) +
  xlab("Date") + ylab("Total doses, by city and date") +
  theme(
    axis.ticks = element_blank(),
    panel.grid.major.y = element_line(size=0.5, linetype="dotted", colour ="lightgrey"),
    panel.grid.major.x = element_blank(),
    panel.grid.minor = element_blank(),
    panel.border = element_blank(),
    panel.background = element_rect(fill = "white", colour = "white"))


# Try a streamgraph?
# Try a circular barplot? 


# Questions
# - We can only add these up if we think of them as just doses, and not first or second. Does first or second dose matter for this analysis?
# - Do missing dates mean no vaccines were given or that we just don't have the data?
# Are these the ZIP codes of all the people who received vaccines in Cicero?
# What are the main suburbs we want to compare Cicero to?

