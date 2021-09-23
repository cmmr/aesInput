library(ggplot2)
library(magick)
library(magrittr)

for (i in 0:18) {
  
  p <- ggplot() +
    geom_point(aes(x = 1, y = 1), shape=i) +
    theme_void()
  
  ggsave(paste0(i, ".png"), p, width = 100, height = 100, units = "px", dpi = 1000)
  
  image_read(paste0(i, ".png")) %>%
    image_trim() %>%
    image_scale("40x40") %>%
    image_extent("40x40") %>%
    image_write(paste0(i, ".png"), "png")
  
  # image_read(paste0(i, "_lg.png")) %>%
  #   image_scale("28x28") %>%
  #   image_write(paste0(i, "_sm.png"), "png")
  
}

