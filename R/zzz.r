.onLoad <- function(...) {
  
  addResourcePath('aesinput', system.file('assets', package='aesInput'))
  # addResourcePath('aesinput', 'D:/Dropbox/Baylor/GitHub/aesInput/assets')
  
  registerInputHandler("AesInput", force = TRUE, function (value, session, inputId) {
    
    if (is.character(value))
      value <- jsonlite::fromJSON(value, simplifyDataFrame = FALSE)
    
    if (is.null(value))                 return (NULL)
    if (length(value) == 0)             return (NULL)
    
    for (i in seq_along(value)) {
      attr(value[[i]], 'class') <- c("aesInput", "list")
      
      if (value[[i]][['picker']] == "shape" || value[[i]][['mode']] == "numeric")
        value[[i]][['vals']] %<>% as.numeric()
    }
    
    return (value)
  })
}
