class DATA_Helper < Middleman::Extension
  def initialize(app, options_hash={}, &block)
    super
  end
  helpers do

    # csv_data
    def csv(file)
      csv_data = File.read(File.join('csv', file))
      hash = CSV.new(csv_data, :headers => :first_row, :header_converters => :symbol)
      array = hash.to_a.map { |row| row.to_hash }
      obj = {}
      hash.headers.each_with_index do |e, i|
        if i > 0
          obj[e] = {} 
          array.each do |j|
            obj[e][j[hash.headers[0]]] = j[e]
          end
        end
      end
      return obj
    end

    def img_link img
      "../../../images/#{img}"
    end

  end
end
::Middleman::Extensions.register(:data_helper, DATA_Helper)

