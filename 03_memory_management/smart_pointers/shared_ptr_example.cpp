/**
 * shared_ptr_example.cpp - Shared Ownership
 * 
 * std::shared_ptr allows multiple owners.
 * Resource freed when last owner is destroyed.
 */

#include <iostream>
#include <memory>
#include <format>
#include <vector>

class Document {
    std::string title_;
public:
    explicit Document(std::string title) : title_(std::move(title)) {
        std::cout << std::format("Document '{}' created\n", title_);
    }
    ~Document() {
        std::cout << std::format("Document '{}' destroyed\n", title_);
    }
    void print() const {
        std::cout << std::format("Document: {}\n", title_);
    }
};

int main() {
    std::shared_ptr<Document> doc1;
    
    {
        // Create shared document
        auto doc2 = std::make_shared<Document>("Report");
        std::cout << std::format("Reference count: {}\n", doc2.use_count());
        
        // Share ownership
        doc1 = doc2;
        std::cout << std::format("Reference count: {}\n", doc2.use_count());
        
        // Store in container (another owner)
        std::vector<std::shared_ptr<Document>> docs;
        docs.push_back(doc2);
        std::cout << std::format("Reference count: {}\n", doc2.use_count());
        
        // doc2 and vector go out of scope here
    }
    
    std::cout << std::format("After scope - count: {}\n", doc1.use_count());
    doc1->print();  // Still valid!
    
    doc1.reset();   // Explicitly release
    std::cout << "Document now destroyed\n";
    
    return 0;
}
