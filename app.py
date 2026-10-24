import streamlit as st
from engine.circuits import coin_counts
from engine.stats import p_value_at_least

st.set_page_config(page_title="Quantum Files", page_icon="🐹")
st.title("🐹 Quantum Files — El patrón invisible")
st.caption("Esqueleto de la interfaz (persona A). Datos del motor: STUB hasta que B termine.")
c = coin_counts(10, seed=1)
st.write("Resultado de prueba:", c, "· p-valor (7 de 10):", round(p_value_at_least(7, 10), 4))
