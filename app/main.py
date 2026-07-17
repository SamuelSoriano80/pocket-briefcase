from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base
from app.routes import auth as auth_routes
# from app.routes import case as case_routes


Base.metadata.create_all(bind=engine)

app = FastAPI(title="Pocket Briefcase API")

# Allows React (running on another port) to make requests to the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    """Root endpoint to check if the API is running."""
    
    return {"message": "Pocket Briefcase API is running!"}


app.include_router(auth_routes.router, prefix="/auth", tags=["auth"])
# app.include_router(case_routes.router, prefix="/cases", tags=["cases"])