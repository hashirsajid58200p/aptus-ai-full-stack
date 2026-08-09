import React, { useState, useEffect } from "react";
import { MdDeleteOutline, MdInfoOutline, MdOutlineEdit } from "react-icons/md";
import { FaRobot, FaCommentDots } from "react-icons/fa";
import {
  List,
  LayoutGrid,
  ChevronDown,
  Trash2,
  Plus,
  Pencil,
} from "lucide-react";
import { generateJSONContent } from "@/lib/groq";

import { CardHeader, CardTitle, CardContent } from "components/ui/card";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Textarea } from "components/ui/textarea";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "components/ui/dialog";

import { useDispatch, useSelector } from "react-redux";
import {
  addBusinessDetails,
  updateBusinessDetails,
  deleteBusinessDetails,
  loadUser,
  clearState,
} from "@/slices/userSlice";
import toast from "react-hot-toast";
import { AiFillThunderbolt } from "react-icons/ai";
import Loader from "../Loader";

const BusinessDetails = () => {
  const dispatch = useDispatch();
  const [layout, setLayout] = useState("carousel");
  const {
    isBusinessDetailsAdded,
    isBusinessDetailsUpdated,
    isBusinessDetailsDeleted,
    user,
  } = useSelector((state) => state.user);

  // Dynamic Q&A list state
  const [qaList, setQaList] = useState([
    { id: Date.now(), question: "", answer: "" },
  ]);
  const [loading, setLoading] = useState(false);

  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(null);

  // Edit Modal state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    id: null,
    question: "",
    answer: "",
  });

  const handleAddField = () => {
    setQaList((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), question: "", answer: "" },
    ]);
  };

  const handleRemoveField = (id) => {
    if (qaList.length > 1) {
      setQaList((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleFieldChange = (id, fieldName, value) => {
    setQaList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [fieldName]: value } : item
      )
    );
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await dispatch(deleteBusinessDetails(id)).unwrap();
      toast.success("Business detail deleted successfully");
      await dispatch(loadUser());
    } catch (err) {
      toast.error(err?.message || "Failed to delete detail");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = (detail) => {
    setEditFormData({
      id: detail._id,
      question: detail.question,
      answer: detail.answer,
    });
    setIsEditOpen(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!editFormData.question.trim() || !editFormData.answer.trim()) {
      toast.error("Please fill all the fields");
      return;
    }
    setLoading(true);
    try {
      await dispatch(
        updateBusinessDetails({
          id: editFormData.id,
          question: editFormData.question,
          answer: editFormData.answer,
        })
      ).unwrap();
      toast.success("Business detail updated successfully");
      setIsEditOpen(false);
      await dispatch(loadUser());
    } catch (err) {
      toast.error(err?.message || "Failed to update detail");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validPairs = qaList.filter(
      (item) => item.question.trim() !== "" && item.answer.trim() !== ""
    );

    if (validPairs.length === 0) {
      toast.error("Please fill all the fields");
      return;
    }

    setLoading(true);
    try {
      await dispatch(addBusinessDetails({ details: validPairs })).unwrap();
      toast.success("Business details added successfully");
      setQaList([{ id: Date.now(), question: "", answer: "" }]);
      await dispatch(loadUser());
    } catch (err) {
      toast.error(err?.message || "Failed to add business details");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAI = async () => {
    setLoading(true);
    const businessDetails = `
      Business Name: ${user?.bussinessName || "N/A"},
      Business Category: ${user?.bussinessCategory || "N/A"},
      Business Description: ${user?.bussinessDescription || "N/A"}
    `;

    const prompt = `Generate exactly 5 AI questions for the following business details from user perspective (end users) which a user can ask from a chatbot about the business: ${businessDetails}.

Please return an array of exactly 5 questions in JSON format. Each question should be an object with "question" and "answer" properties. Format: [{"question": "What are your business hours?", "answer": "We are open Monday to Friday 9 AM to 6 PM"}]`;

    try {
      const questions = await generateJSONContent(prompt);

      if (Array.isArray(questions)) {
        setGeneratedQuestions(questions);
      } else if (questions?.content && Array.isArray(questions.content)) {
        setGeneratedQuestions(questions.content);
      } else {
        setGeneratedQuestions([
          {
            question: "What services do you offer?",
            answer: `We specialize in ${user?.bussinessCategory || "various services"} and provide comprehensive solutions.`,
          },
          {
            question: "How can I contact support?",
            answer: "You can reach out to our team through our official support channel.",
          },
          {
            question: "What makes your business unique?",
            answer: user?.bussinessDescription || "We are committed to providing top-quality services.",
          },
          {
            question: "What are your business hours?",
            answer: "We are typically open Monday to Friday, 9 AM to 6 PM.",
          },
          {
            question: "Do you offer custom pricing or packages?",
            answer: "Please reach out to our team to discuss custom pricing packages suited to your needs.",
          },
        ]);
      }
    } catch (error) {
      console.error("Error generating AI questions:", error);
      toast.error("An error occurred while generating AI questions.");
      setGeneratedQuestions([
        {
          question: "What services do you offer?",
          answer: `We specialize in ${user?.bussinessCategory || "various services"} and provide comprehensive solutions.`,
        },
        {
          question: "How can I contact support?",
          answer: "You can reach out to our team through our official support channel.",
        },
      ]);
    }

    setLoading(false);
  };

  const handlePickQuestion = (questionObj) => {
    setQaList((prev) => {
      const emptyIndex = prev.findIndex(
        (item) => !item.question.trim() && !item.answer.trim()
      );
      if (emptyIndex !== -1) {
        const updated = [...prev];
        updated[emptyIndex] = {
          ...updated[emptyIndex],
          question: questionObj.question,
          answer: questionObj.answer,
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            id: Date.now() + Math.random(),
            question: questionObj.question,
            answer: questionObj.answer,
          },
        ];
      }
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
    setGeneratedQuestions([]);
    toast.success("AI Question added to form!");
  };

  const handleDropdownToggle = (index) => {
    setSelectedQuestionIndex(selectedQuestionIndex === index ? null : index);
  };

  const handleToggleLayout = (selectedLayout) => {
    setLayout(selectedLayout);
  };

  useEffect(() => {
    if (
      isBusinessDetailsAdded ||
      isBusinessDetailsUpdated ||
      isBusinessDetailsDeleted
    ) {
      dispatch(loadUser());
      dispatch(clearState());
    }
  }, [
    isBusinessDetailsAdded,
    isBusinessDetailsUpdated,
    isBusinessDetailsDeleted,
    dispatch,
  ]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen text-gray-700">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-xl relative z-10 transform transition-transform">
        <CardHeader className="flex justify-between p-6">
          <CardTitle className="text-2xl font-semibold text-black-500">
            Company Details
          </CardTitle>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="p-2 text-black hover:text-gray-400 transition-all">
                <MdInfoOutline className="text-2xl" />
              </button>
            </AlertDialogTrigger>

            <AlertDialogContent className="bg-white text-gray-900 border rounded-xl p-6 shadow-2xl">
              <AlertDialogTitle className="text-lg font-semibold mb-2">
                How to Provide Business Details
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600">
                <p className="mb-4">
                  To help us train our models effectively, please provide
                  detailed answers to the following:
                </p>
                <ul className="list-disc pl-5 mb-4">
                  <li>
                    Enter business-related questions in the "Question" field.
                  </li>
                  <li>Provide comprehensive answers in the "Answer" field.</li>
                </ul>
              </AlertDialogDescription>
              <div className="mt-4 flex justify-end space-x-2">
                <AlertDialogCancel className="bg-[#9e45f1] hover:bg-[#6c2794] text-white px-4 py-2 rounded-lg border-none">
                  Close
                </AlertDialogCancel>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        </CardHeader>

        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Dynamic list of Questions and Answers */}
            <div className="space-y-6">
              {qaList.map((item, index) => (
                <div key={item.id} className="relative space-y-4 pt-2 border-b pb-4 last:border-b-0">
                  {qaList.length > 1 && (
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleRemoveField(item.id)}
                        className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1 transition"
                        title="Remove Question"
                      >
                        <Trash2 className="w-4 h-4" /> Remove
                      </button>
                    </div>
                  )}

                  <div>
                    <label
                      htmlFor={`question-${item.id}`}
                      className="block text-sm font-medium"
                    >
                      Company Related Question
                    </label>
                    <div className="relative">
                      <Input
                        id={`question-${item.id}`}
                        name="question"
                        value={item.question}
                        onChange={(e) =>
                          handleFieldChange(item.id, "question", e.target.value)
                        }
                        required
                        placeholder="What is our Company Objective? 🚀"
                        onFocus={(e) => (e.target.placeholder = "")}
                        onBlur={(e) =>
                          (e.target.placeholder =
                            "What is our Company Objective? 🚀")
                        }
                        className="mt-2 block w-full border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:ring focus:ring-blue-500"
                      />
                      <FaRobot className="absolute right-3 top-3 text-xl text-[#9e45f1]" />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor={`answer-${item.id}`}
                      className="block text-sm font-medium"
                    >
                      Answer
                    </label>
                    <div className="relative">
                      <Textarea
                        id={`answer-${item.id}`}
                        name="answer"
                        value={item.answer}
                        onChange={(e) =>
                          handleFieldChange(item.id, "answer", e.target.value)
                        }
                        required
                        placeholder="Our objective is to provide the best services to our customers... 💼"
                        onFocus={(e) => (e.target.placeholder = "")}
                        onBlur={(e) =>
                          (e.target.placeholder =
                            "Our objective is to provide the best services to our customers... 💼")
                        }
                        rows={4}
                        className="mt-2 block w-full border border-gray-200 bg-white text-gray-900 placeholder-gray-400"
                      />
                      <FaCommentDots className="absolute right-3 top-3 text-xl text-[#9e45f1]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Single Add Question Button */}
            <div className="flex justify-end">
              <Button
                type="button"
                onClick={handleAddField}
                variant="outline"
                className="flex items-center gap-2 border-[#9e45f1] text-[#9e45f1] hover:bg-purple-50 font-semibold"
              >
                <Plus className="w-5 h-5" /> Add Another Question
              </Button>
            </div>

            {/* Generate with AI Button */}
            <Button
              type="button"
              onClick={handleGenerateAI}
              className="w-full py-3 text-lg font-semibold bg-neon transition-all relative text-white bg-purple-600"
              style={{
                background: "linear-gradient(90deg, #FF00FF 0%, #FFA500 100%)",
              }}
            >
              <AiFillThunderbolt className="text-xl mr-2" /> Generate with AI
            </Button>

            {loading && (
              <div className="flex justify-center my-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon"></div>
              </div>
            )}

            {/* Display AI-generated Questions */}
            {generatedQuestions.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold">
                  AI-Generated Questions
                </h3>
                <div className="space-y-2">
                  {generatedQuestions.map((q, index) => (
                    <div
                      key={index}
                      className="bg-white shadow-xl p-4 rounded-lg border"
                    >
                      <div
                        className="flex justify-between cursor-pointer"
                        onClick={() => handleDropdownToggle(index)}
                      >
                        <h4 className="font-semibold">{q.question}</h4>
                        <span className="text-gray-400">
                          {selectedQuestionIndex === index ? "▲" : "▼"}
                        </span>
                      </div>
                      {selectedQuestionIndex === index && (
                        <div className="mt-2 text-gray-600">
                          {q.answer}
                        </div>
                      )}
                      <Button
                        type="button"
                        onClick={() => handlePickQuestion(q)}
                        className="mt-2 bg-[#9e45f1] hover:bg-[#6c2794] rounded-xl text-white"
                      >
                        Select
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full py-3 text-lg font-semibold bg-[#9e45f1] hover:bg-[#6c2794] text-white"
            >
              Submit
            </Button>
          </form>
        </CardContent>
      </div>

      {/* Floating Carousel / Accordion List */}
      <div className="w-full max-w-4xl mt-8">
        <div className="p-4">
          {/* Layout Toggle Icons */}
          <div className="flex justify-end mb-4 space-x-4">
            <LayoutGrid
              onClick={() => handleToggleLayout("carousel")}
              className={`cursor-pointer text-gray-500 hover:text-blue-500 transition ${
                layout === "carousel" ? "text-blue-500" : ""
              }`}
              size={24}
            />
            <List
              onClick={() => handleToggleLayout("accordion")}
              className={`cursor-pointer text-gray-500 hover:text-blue-500 transition ${
                layout === "accordion" ? "text-blue-500" : ""
              }`}
              size={24}
            />
          </div>

          {/* Conditionally render based on selected layout */}
          {layout === "carousel" ? (
            <div className="w-full max-w-4xl mt-8">
              <Carousel
                plugins={[
                  Autoplay({
                    delay: 3000,
                  }),
                ]}
                className="rounded-xl shadow-xl overflow-hidden relative"
              >
                <CarouselContent>
                  {user?.bussinessDetails?.map((item, index) => (
                    <CarouselItem key={item._id || index}>
                      <div className="relative p-6 bg-white text-gray-800 rounded-xl transition-transform transform hover:scale-105 max-h-[35vh] min-h-[35vh]">
                        <div className="h-full relative group">
                          <CardHeader className="flex flex-row align-middle gap-3 pr-20">
                            <FaRobot className="text-2xl text-[#9e45f1]" />
                            <CardTitle className="text-lg">
                              {item.question}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="pt-2">
                            <p>{item.answer}</p>
                          </CardContent>
                          <div className="absolute top-3 right-3 flex items-center gap-1">
                            {/* Edit Icon */}
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(item)}
                              className="p-2 text-[#9e45f1] hover:text-[#6c2794] transition-all"
                              title="Edit"
                            >
                              <Pencil className="w-5 h-5" />
                            </button>

                            {/* Delete Icon */}
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <button className="p-2 text-red-500 hover:text-red-700 transition-all">
                                  <MdDeleteOutline className="text-2xl" />
                                </button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="bg-white text-gray-900 border rounded-xl p-6 shadow-2xl">
                                <AlertDialogTitle className="text-lg font-semibold mb-2">
                                  Delete Confirmation
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-gray-600">
                                  Are you sure you want to delete this business detail?
                                </AlertDialogDescription>
                                <div className="mt-4 flex justify-end space-x-2">
                                  <AlertDialogCancel className="bg-gray-100 text-gray-700 hover:bg-gray-200 border-none px-4 py-2 rounded-lg">
                                    Cancel
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(item._id)}
                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </div>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          ) : (
            <div className="accordion space-y-4">
              {user?.bussinessDetails?.map((detail, index) => (
                <div key={detail._id || index} className="border rounded-lg bg-white">
                  <div
                    onClick={() => {
                      const panel = document.getElementById(`panel-${index}`);
                      if (panel) panel.classList.toggle("hidden");
                    }}
                    className="flex px-4 py-2 bg-gray-50 rounded-t-lg hover:bg-gray-100 cursor-pointer items-center justify-between"
                  >
                    <button className="w-full text-left font-medium text-gray-800">
                      {detail.question}
                    </button>
                    <span className="flex gap-3 items-center shrink-0">
                      <Pencil
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEdit(detail);
                        }}
                        className="w-4 h-4 text-[#9e45f1] hover:text-[#6c2794] cursor-pointer"
                      />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Trash2
                            onClick={(e) => e.stopPropagation()}
                            color="red"
                            className="w-4 h-4 cursor-pointer z-50"
                          />
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-white text-gray-900 border rounded-xl p-6 shadow-2xl">
                          <AlertDialogTitle className="text-lg font-semibold mb-2">
                            Delete Confirmation
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-gray-600">
                            Are you sure you want to delete this detail?
                          </AlertDialogDescription>
                          <div className="mt-4 flex justify-end space-x-2">
                            <AlertDialogCancel className="bg-gray-100 text-gray-700 hover:bg-gray-200 border-none px-4 py-2 rounded-lg">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(detail._id)}
                              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                            >
                              Delete
                            </AlertDialogAction>
                          </div>
                        </AlertDialogContent>
                      </AlertDialog>
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    </span>
                  </div>
                  <div
                    id={`panel-${index}`}
                    className="px-4 py-2 bg-gray-50 hidden rounded-b-lg border-t-2"
                  >
                    <p>{detail.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal (Aligned with theme) */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-white text-gray-900 max-w-lg rounded-xl p-6 shadow-2xl border">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <MdOutlineEdit className="text-[#9e45f1] text-2xl" /> Edit Question & Answer
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Update the question and answer for your chatbot's training context.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpdateSubmit} className="space-y-4 mt-4">
            <div>
              <label htmlFor="edit-question" className="block text-sm font-medium text-gray-700">
                Company Related Question
              </label>
              <div className="relative">
                <Input
                  id="edit-question"
                  value={editFormData.question}
                  onChange={(e) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      question: e.target.value,
                    }))
                  }
                  required
                  className="mt-2 block w-full border border-gray-200 bg-white text-gray-900 focus:ring focus:ring-blue-500"
                />
                <FaRobot className="absolute right-3 top-3 text-xl text-[#9e45f1]" />
              </div>
            </div>

            <div>
              <label htmlFor="edit-answer" className="block text-sm font-medium text-gray-700">
                Answer
              </label>
              <div className="relative">
                <Textarea
                  id="edit-answer"
                  value={editFormData.answer}
                  onChange={(e) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      answer: e.target.value,
                    }))
                  }
                  required
                  rows={4}
                  className="mt-2 block w-full border border-gray-200 bg-white text-gray-900"
                />
                <FaCommentDots className="absolute right-3 top-3 text-xl text-[#9e45f1]" />
              </div>
            </div>

            <DialogFooter className="flex justify-end space-x-2 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditOpen(false)}
                className="bg-gray-100 text-gray-700 hover:bg-gray-200 border-none"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#9e45f1] hover:bg-[#6c2794] text-white font-semibold"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BusinessDetails;
