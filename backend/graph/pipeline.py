from langgraph.graph import StateGraph, END
from graph.state import ResearchState
from agents.planner import planner_node
from agents.searcher import searcher_node
from agents.ranker import ranker_node
from agents.writer import writer_node
from agents.factcheck import factcheck_node
from agents.report import report_node

def build_graph():
    graph = StateGraph(ResearchState)

    graph.add_node("planner",   planner_node)
    graph.add_node("searcher",  searcher_node)
    graph.add_node("ranker",    ranker_node)
    graph.add_node("writer",    writer_node)
    graph.add_node("factcheck", factcheck_node)
    graph.add_node("report",    report_node)

    graph.set_entry_point("planner")
    graph.add_edge("planner",   "searcher")
    graph.add_edge("searcher",  "ranker")
    graph.add_edge("ranker",    "writer")
    graph.add_edge("writer",    "factcheck")
    graph.add_edge("factcheck", "report")
    graph.add_edge("report",    END)

    return graph.compile()

pipeline = build_graph()
