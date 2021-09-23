#' Generate aesthetic mappings based on one or more aesInputs.
#' 
#' @param ...  aesInput values, arbitrarily nested in lists. Other 
#'        \link{ggplot2::aes_string()} arguments can go here as well and will
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
    
    if (picker == 'color') {
      if (is.null(p[['color']])) p[['color']] <- colname
      if (is.null(p[['fill']]))  p[['fill']]  <- colname
      
    } else if (picker == 'shape') {
      if (is.null(p[['shape']])) p[['shape']] <- colname
      
    } else if (picker == 'pattern') {
      if (is.null(p[['pattern_type']]))
        p[['pattern_type']] <- colname
    }
  }
  
  if ('pattern_type' %in% names(p) && any(c('color', 'fill') %in% names(p)))
    p[['pattern_fill']] <- p[['color']] %||% p[['fill']]
  
  if (exec) do.call(aes_string, p) else p
}


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


#' Convert aesInputs into named vectors. 
#' 
#' @param ...  aesInput values, arbitrarily nested in lists.
#' @return A list of aesInput values.
#' @family aesInput
#' @export
#'
#'
# color, shape, and pattern are named in the returned list; rest are not.
ai.vals <- function (...) {
  results <- list()
  
  for (ai in ai.flatten(list(...))) {
    
    if (ai[['class']] == "numeric") {
      results %<>% c(c('from' = ai[['from']], 'to' = ai[['to']]))
      
    } else {
    
      scp <- intersect(names(ai), c('color', 'shape', 'pattern'))
      sel <- ai[['selected']]
      
      if (length(scp) == 1) { results[[scp]] <- setNames(ai[[scp]], sel)
      } else                { results        %<>% c(setNames(sel, sel)) }
    }
  }
  
  return (results)
}


ai.scales <- function (..., exec=TRUE) {
  
  vals <- ai.vals(...)[c('color', 'shape', 'pattern')]
  
  pat <- isTRUE('pattern' %in% names(vals))
  pkg <- ifelse(pat, "ggpattern", "ggplot2")
  if (pat) names(vals) %<>% sub("(color|shape)", "pattern_\\1", .)
  
  # If exec is TRUE, return a ggproto object, otherwise return a list
  # describing what functions should be run with what parameters.
  if (exec) {
    result <- NULL
    for (i in names(vals)) {
      fun <- do.call(`::`, list(pkg, sprintf("scale_%s_manual", i)))
      res <- do.call(fun, list(values = vals[[i]]))
      result <- if (is.null(result)) res else result + res
    }
    return (result)
    
  } else {
    names(vals) %<>% sprintf("%s::scale_%s_manual", pkg, .)
    return (vals)
  }
  
}


ai.subset <- function (data, ...) {
  
  for (ai in ai.flatten(list(...))) {
    
    colname <- ai[['name']]
    colvals <- data[[colname]]
    
    if (ai[['class']] == "numeric") {
      keep <- colvals >= ai[['from']] && colvals <= ai[['to']]
      
    } else {
      keep <- as.character(colvals) %in% ai[['selected']]
      data[[colname]] %<>% factor(levels = ai[['selected']])
    }
    data <- data[keep,,drop=FALSE]
  }
  
  return (data)
}

