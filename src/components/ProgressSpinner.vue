<template>
    <div class="progress-spinner">
      <div class="overlay">
        <div class="spinner"></div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ProgressSpinner',
  }
  </script>
  
  <style>
  .progress-spinner {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .overlay {
    position: relative;
  }
  
  .spinner {
    border: 4px solid #f3f3f3; /* Light grey */
    border-top: 4px solid var(--main-color); /* Blue */
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  </style>