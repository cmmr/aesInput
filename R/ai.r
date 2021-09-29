
#' Turns nested lists of aesInputs into a single list.
#' 
#' @param ...  aesInput values, arbitrarily nested in lists.
#' @return A list of aesInput values.
#' @family aesInput
#' @export
#'
ai.flatten <- function (...) {
  obj <- list(...)
  if (length(obj) == 1) obj <- obj[[1]]
  
  if (is.null(obj))         return (list())
  if (is(obj,  'aesInput')) return (list(obj))
  if (!is(obj, 'list'))     return (list())
  
  flat <- list()
  for (i in seq_along(obj))
    flat <- c(flat, ai.flatten(obj[[i]]))
  
  return (flat)
}


#' Subset a data.frame based on aesInput(s) values.
#' 
#' @param data  A data.frame/tibble/etc object.
#' @param ...  aesInput values, arbitrarily nested in lists.
#' @return Subsetted \code{data} object.
#' @family aesInput
#' @export
#'
ai.subset <- function (data, ...) {
  
  for (ai in ai.flatten(list(...))) {
    
    colname <- ai[['column']]
    colvals <- data[[colname]]
    
    if (ai[['mode']] == "numeric") {
      keep <- colvals >= ai[['vals']][[1]] & colvals <= ai[['vals']][[2]]
      
    } else {
      if (is.character(colvals)) {
        keep <- colvals %in% ai[['keys']]
      } else {
        keep <- as.character(colvals) %in% ai[['keys']]
        data[[colname]] %<>% factor(levels = ai[['keys']])
      }
    }
    
    data <- data[keep,,drop=FALSE]
  }
  
  return (data)
}



#' Generate aesthetic mappings based on one or more aesInputs.
#' 
#' @param ...  aesInput values, arbitrarily nested in lists. Other 
#'        \link[ggplot2]{aes_string} arguments can go here as well and will
#'        override those from aesInputs.
#' @param exec  When \code{TRUE} (the default) an aes object will be returned,
#'        otherwise a list of aes key/value pairs will be returned.
#' @return See \code{exec}, above.
#' @family aesInput
#' @export
#'
ai.aes <- function (..., exec = TRUE) {
  dots <- list(...)
  
  # Named parameters. E.g. ai.aes(x='carat', y='price')
  p <- dots[names(dots) != ""]
  
  # Add color, shape, and pattern column names to aes.
  # Don't overwrite values given as named parameters above.
  for (ai in ai.flatten(dots[names(dots) == ""])) {
    
    picker  <- ai[['picker']]
    colname <- capture.output(as.name(ai[['column']]))
    
    keys <- if (picker == 'color')   { c('color', 'fill')
    } else  if (picker == 'shape')   { c('shape')
    } else  if (picker == 'pattern') { c('pattern_type')
    } else                           { c() }
    
    for (k in keys)
      if (is.null(p[[k]]))
        p[[k]] <- colname
  }
  
  if ('pattern_type' %in% names(p) && any(c('color', 'fill') %in% names(p)))
    p[['pattern_fill']] <- p[['color']] %||% p[['fill']]
  
  if (exec) do.call(ggplot2::aes_string, p) else p
}


#' Assign colors/shapes/patterns to data values using ggplot2 or ggpattern 
#' scales.
#' 
#' @param ...  aesInput values, arbitrarily nested in lists. Other 
#'        \link[ggplot2]{aes_string} arguments can go here as well and will
#'        override those from aesInputs.
#'        
#' @param exec  If exec is TRUE (the default), returns a ggproto object, a list
#'        describing what functions should be run with what parameters is
#'        returned.
#'        
#' @return A list of ggproto objects, or a descriptive list thereof if 
#'         \code{exec=FALSE}.
#'         
#' @family aesInput
#' @export
#'
ai.scales <- function (..., exec=TRUE) {
  
  vals <- list()
  for (ai in ai.flatten(list(...)))
    if (ai[['picker']] %in% c('color', 'shape', 'pattern'))
      vals[[ai[['picker']]]] <- setNames(ai[['vals']], ai[['keys']])
  
  # Use ggpattern's scales if any aesthetic is a pattern
  pat <- isTRUE('pattern' %in% names(vals))
  pkg <- ifelse(pat, "ggpattern", "ggplot2")
  if (pat) names(vals) %<>% sub("(color|shape)", "pattern_\\1", .)
  
  # Run the functions or return just the specs
  if (exec) {
    result <- list()
    for (i in names(vals)) {
      fun <- do.call(`::`, list(pkg, sprintf("scale_%s_manual", i)))
      res <- do.call(fun, list(values = vals[[i]]))
      result %<>% c(res)
    }
    return (result)
    
  } else {
    names(vals) %<>% sprintf("%s::scale_%s_manual", pkg, .)
    return (vals)
  }
  
}

