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

colnames(ar2_data) <- c("zip", "date_time") # Are these first or second doses?
colnames(ar3_data) <- c("zip", "date_time") # Are these first or second doses?
colnames(ar4_data) <- c("zip", "date_time") # Note: these are SECOND doses (has extra row)
colnames(ar5_data) <- c("zip", "date_time") # Are these first or second doses?
colnames(ar6_data) <- c("zip", "date_time") # Note: these are FIRST doses (has extra row)

# Clean up the data
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

# Look at unique ZIP codes
unique(jan_data.clean$zip)

# Look at just Cicero
cicero_data <- jan_data.clean %>% 
  filter(zip == "60804")
