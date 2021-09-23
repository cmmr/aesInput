.onLoad <- function(...) {
  
  addResourcePath('aesinput', system.file('assets', package='aesInput'))
  # addResourcePath('aesinput', 'D:/Dropbox/Baylor/GitHub/aesInput/assets')
  
  registerInputHandler("AesInput", force = TRUE, function (value, session, inputId) {
    
    if (is.character(value))
      value <- jsonlite::fromJSON(value)
    
    if (is.null(value))                 return (NULL)
    if (length(value) == 0)             return (NULL)
    if (is.null(value[['column']]))     return (NULL)
    if (length(value[['column']]) == 0) return (NULL)
    
    attr(value, 'class') <- c("aesInput", "list")
    
    return (value)
  })
}